const express = require('express');
const householdRouter = express.Router();

// Household routes
householdRouter.get('/households', authMiddleware, searchHouseholds);
householdRouter.post('/households/join', authMiddleware, joinHousehold);
householdRouter.post('/households/create', authMiddleware, createHousehold);

module.exports = householdRouter;