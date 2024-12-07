import express from 'express';
import * as inventoryHandler from '../handlers/inventory-handler';

const router = express.Router();

router.post('/', inventoryHandler.create);             // Create a new item
router.get('/', inventoryHandler.get);              // Get all items
router.get('/:id', inventoryHandler.getById);          // Get item by ID
router.put('/:id', inventoryHandler.update);
router.patch('/:id/quantity', inventoryHandler.updateQuantity);             // Update item
router.delete('/:id', inventoryHandler.deleteItem);    // Delete item

export default router;
