const express = require('express');
const shoppingItemsRouter = express.Router();

// Household routes
// Shopping routes
shoppingItemsRouter.post('/shopping/add', addItem);
shoppingItemsRouter.get('/shopping/items', getItems);
shoppingItemsRouter.get('/shopping/bought-items', getBoughtItems);
shoppingItemsRouter.post('/shopping/buy', buyItem);
shoppingItemsRouter.delete('/shopping/:id', deleteItem);
shoppingItemsRouter.delete('/shopping/bought/:id', deleteBoughtItem);

module.exports = shoppingItemsRouter;