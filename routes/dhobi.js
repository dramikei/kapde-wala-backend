const express = require('express');
const routes = express.Router();

const dhobiController = require('../controllers/dhobi');

routes.post('/approveOrder', dhobiController.approveOrder);

routes.post('/rejectOrder', dhobiController.rejectOrder);

routes.post('/completeOrder', dhobiController.completeOrder);

routes.get('/', dhobiController.fetchAllApprovedOrPlaced);

routes.get('/all', dhobiController.fetchAll);

module.exports = routes;
