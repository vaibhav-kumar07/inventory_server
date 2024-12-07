import { Request, Response, NextFunction } from 'express';
import InventoryController from '../controllers/inventory-controller';

const inventoryController = new InventoryController();

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('create', req.body)
        const createdItem = await inventoryController.create(req.body);
        res.status(201).json({ message: 'Item created successfully', data: createdItem });
    } catch (error) {
        next(error);
    }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pagination = req.query.pagination || {};
        const items = await inventoryController.get(pagination);
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await inventoryController.getById(req.params.id);
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedItem = await inventoryController.update(req.params.id, req.body);
        res.status(200).json({ message: 'Item updated successfully', data: updatedItem });
    } catch (error) {
        next(error);
    }
};
export const updateQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await inventoryController.updateQuantity(req.params.id, req.body.quantity);
        res.status(200).json({ message: "Quantity updated successfully" });
    } catch (error) {
        next(error);
    }
};


export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await inventoryController.delete(req.params.id);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        next(error);
    }
};
