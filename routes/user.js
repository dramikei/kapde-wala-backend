const express = require('express');
const routes = express.Router();

const userController = require('../controllers/user');
const loginController = require('../controllers/login');

routes.post('/login', loginController.login);

routes.post('/all', userController.fetchUser);

routes.post('/status', userController.getStatus);

routes.post('/createOrder', userController.createOrder);

routes.post('/cancelOrder', userController.cancelOrder);

module.exports = routes;
