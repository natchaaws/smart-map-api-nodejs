// src\services\websocketService.js
const websocketModel = require('../models/websocketModel');

module.exports = {
    async fetchEventsWithPagination(page, perPage, filters) {
        const offset = (page - 1) * perPage;
        const data = await websocketModel.getPaginatedEvents(offset, perPage, filters);
        const totalItems = await websocketModel.getTotalCount(filters);

        return {
            pagination: {
                page,
                perPage,
                totalPages: Math.ceil(totalItems / perPage),
                totalItems
            },
            data
        };
    },
    async getDistinctBodyFields() {
        return await websocketModel.getDistinctBodyFields();
    }, async getPorts() {
        return await websocketModel.getDistinctPorts();
    },

    async getHeaders() {
        return await websocketModel.getDistinctHeaders();
    }
};
