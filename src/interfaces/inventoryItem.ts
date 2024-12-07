export interface IInventoryItem {
    name: string;
    partNumber: number;
    dateReceived: string;
    dateDispatched: string;
    qrCode: string;
    status: IInventoryItemStatus
    recievedQuantity: number;
    dispachedQuantity: number;
    availableQuantity: number;
}




export enum IInventoryItemStatus {
    Pending = "PENDING",
    Delivered = "DELIVERED",
}