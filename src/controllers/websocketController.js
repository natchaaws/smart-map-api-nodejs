// src/controllers/websocketController.js
const websocketService = require('../services/websocketService');

module.exports = {
    async getEvents(req, res) {
        try {
            const page = parseInt(req.body.page) || 1;
            const perPage = parseInt(req.body.perPage) || 10;

            // Set time zone to Asia/Bangkok
            const timeZone = "Asia/Bangkok";

            // Helper function to format date with Bangkok time zone
            const formatDate = (date) => {
                return new Date(date.toLocaleString("en-US", { timeZone }));
            };

            // Default dates: 7 days ago at 00:00:00 to today at 23:59:59
            const currentDate = new Date();
            const defaultStart = new Date(currentDate.setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000);
            const defaultEnd = new Date(currentDate.setHours(23, 59, 59, 999));

            // Use provided dates or defaults
            const startDate = req.body.startDate
                ? formatDate(new Date(req.body.startDate))
                : defaultStart;
            const endDate = req.body.endDate
                ? formatDate(new Date(req.body.endDate))
                : defaultEnd;
            // Parse ports and bodySearch filters from the query
            const ports = req.body.ports ? req.body.ports.split(',').map(Number) : [];
            // Use bodySearch as-is since it's already an array of objects
            const bodySearch = Array.isArray(req.body.bodySearch) ? req.body.bodySearch : [];

            const filters = { startDate, endDate, ports, bodySearch };

            // Use the service to fetch events with pagination
            const result = await websocketService.fetchEventsWithPagination(page, perPage, filters);

            // Add sequential numbering to each row
            const numberedData = result.data.map((row, index) => ({
                no: (page - 1) * perPage + index + 1,
                ...row
            }));

            // Send the response with the fetched data
            res.status(200).json({
                success: true,
                status: 200,
                message: 'OK',
                result: {
                    pagination: result.pagination,
                    search: {
                        startDate,
                        endDate,
                        ports,
                        bodySearch
                    },
                    data: numberedData
                }
            });
        } catch (error) {
            console.error('Error fetching websocket events:', error);
            res.status(500).json({
                success: false,
                status: 500,
                message: 'Internal Server Error',
                error
            });
        }

    }, async getBodyFields(req, res) {
        try {
            const result = await websocketService.getDistinctBodyFields();
            res.status(200).json({
                success: true,
                status: 200,
                message: 'OK',
                result: {
                    data: result
                }
            });
            console.log("Show result Successfully!");
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                status: 500,
                message: 'Internal Server Error',
                error
            });
        }
    },
    async getPorts(req, res) {
        try {
            const ports = await websocketService.getPorts();
            res.status(200).json({
                success: true,
                status: 200,
                message: 'OK',
                result: {
                    ports
                }
            });
        } catch (error) {
            console.error('Error fetching ports:', error);
            res.status(500).json({
                success: false,
                status: 500,
                message: 'Internal Server Error',
                error
            });
        }
    },

    async getHeaders(req, res) {
        try {
            const headers = await websocketService.getHeaders();
            res.status(200).json({
                success: true,
                status: 200,
                message: 'OK',
                result: {
                    headers
                }
            });
        } catch (error) {
            console.error('Error fetching headers:', error);
            res.status(500).json({
                success: false,
                status: 500,
                message: 'Internal Server Error',
                error
            });
        }
    }

};
