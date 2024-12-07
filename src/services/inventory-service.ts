import { IInventoryItem, IInventoryItemStatus } from '../interfaces/inventoryItem';
import InventoryItem from '../models/inventorItem';
import { getGMTFormattedDate } from '../utils/date-utils';
import { throwBusinessError } from '../utils/error-utils';
import { applyPagination } from '../utils/pagination-sort-utils';

export default class InventoryService {
    private async save(input: Partial<IInventoryItem>, isNew: boolean = true): Promise<IInventoryItem> {
        const inventoryItem = new InventoryItem(input);
        inventoryItem.isNew = isNew;
        return (await inventoryItem.save()).toObject();
    }

    // Create a new inventory item
    public async create(itemData: Partial<IInventoryItem>): Promise<IInventoryItem> {
        const existingItem = await InventoryItem.findOne({ qrCode: itemData.qrCode, dateReceived: itemData.dateReceived });
        console.log("existin item", existingItem)
        // Throw error if the QR code already exists
        throwBusinessError(!!existingItem, 'An Entry of this component with the same date already exists');
        itemData.availableQuantity = itemData.recievedQuantity

        // Use save to create the new item
        return await this.save(itemData, true);
    }

    // Update an existing inventory item
    public async update(id: string, itemData: Partial<IInventoryItem>): Promise<IInventoryItem> {
        const existingItem = await InventoryItem.findById(id);

        // Throw error if the item is not found
        throwBusinessError(!existingItem, 'Item not found for update');

        // Merge the existing item's data with the new data and use save for update
        const updatedItem = { ...existingItem!.toObject(), ...itemData };
        return await this.save(updatedItem, false);
    }
    public async updateQuantity(id: string, quantity: number) {
        try {
            console.log('updateQuantity', id, quantity)
            const existingItem = await InventoryItem.findById(id).lean();

            // Throw error if the item is not found
            throwBusinessError(!existingItem, 'Item not found for update');

            // Check if the updated quantity is less than available quantity
            if (quantity && quantity > existingItem!.availableQuantity) {
                throw new Error('Updated quantity cannot be less than available quantity');
            }
            existingItem!.dispachedQuantity = quantity;
            existingItem!.availableQuantity = existingItem!.availableQuantity - quantity
            existingItem!.dateDispatched = getGMTFormattedDate()
            existingItem!.status = IInventoryItemStatus.Delivered
            return await this.save(existingItem!, false);
        } catch (error) {
            console.log("error", error);
        }
    }




    // Get an inventory item by ID
    public async getById(id: string): Promise<IInventoryItem | null> {
        const item = await InventoryItem.findById(id).lean();
        return item as IInventoryItem;
    }

    // Get all inventory items
    public async get(pagination: any): Promise<any> {
        const { limit, skip } = applyPagination(pagination);


        const leaveList = await InventoryItem.find()
            .collation({ locale: 'en' })
            .skip(skip)
            .limit(limit)
            .lean();


        const totalCount = await InventoryItem.countDocuments();
        return {
            data: leaveList,
            meta: {
                pagination: {
                    page: skip / limit + 1,
                    pageSize: limit,
                    pageCount: Math.ceil(totalCount / limit),
                    total: totalCount,
                },
            },
        };
    }

    // Delete an inventory item
    public async delete(id: string): Promise<void> {
        const deletedItem = await InventoryItem.findByIdAndDelete(id);

        // Throw error if the item is not found
        throwBusinessError(!deletedItem, 'Item not found for deletion');
    }
}
