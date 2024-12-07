import { validateSchema, checkAndThrowError } from '../utils/error-utils';
import { createItemSchema, updateItemSchema, idSchema, updateQuanitySchema } from '../validation-schemas/inventory';
import InventoryService from '../services/inventory-service';

export default class InventoryController {
    private inventoryService = new InventoryService();

    public async create(itemData: any) {
        const validationResult = validateSchema(createItemSchema, itemData);
        checkAndThrowError(validationResult);
        return await this.inventoryService.create(itemData);
    }

    public async get(pagination: any) {
        return await this.inventoryService.get(pagination);
    }

    public async getById(id: string) {
        const validationResult = validateSchema(idSchema, id);
        checkAndThrowError(validationResult);
        return await this.inventoryService.getById(id);
    }

    public async update(id: string, itemData: any) {
        const validationResult = validateSchema(updateItemSchema, { id, ...itemData });
        checkAndThrowError(validationResult);
        return await this.inventoryService.updateQuantity(id, itemData);
    }
    public async updateQuantity(id: string, quantity: number) {

        const validationResult = validateSchema(updateQuanitySchema, { id, quantity });
        checkAndThrowError(validationResult);
        return await this.inventoryService.updateQuantity(id, quantity);
    }

    public async delete(id: string) {
        const validationResult = validateSchema(idSchema, id);
        checkAndThrowError(validationResult);
        return await this.inventoryService.delete(id);
    }
}
