const Sequelize = require('sequelize');

const User = require('../models/user');
const Orders = require('../models/order');
const { ORDER_STATUSES } = require('../util/database');
const Op = Sequelize.Op;

module.exports = {
  approveOrder: (req, res) => {
    const enrolment = req.body.enrolment;
    User.findOne({ where: { id: enrolment } }).then((user) => {
      if (user == null) {
        // res.status(404);
        res.json({
          status: 'error',
          message: 'user not found',
        });
      } else {
        Orders.findOne({
          where: { enrol_id: enrolment, order_status: ORDER_STATUSES.PLACED },
        }).then((order) => {
          if (order == null) {
            res.json({
              status: 'error',
              message: 'order not found',
            });
          } else {
            order.update({ order_status: ORDER_STATUSES.APPROVED });
            res.json({ status: 'success' });
          }
        });
      }
    });
  },
  rejectOrder: (req, res) => {
    const enrolment = req.body.enrolment;
    User.findOne({ where: { id: enrolment } }).then((user) => {
      if (user == null) {
        // res.status(404);
        res.json({
          status: 'error',
          message: 'user not found',
        });
      } else {
        Orders.findOne({
          where: { enrol_id: enrolment, order_status: ORDER_STATUSES.PLACED },
        }).then((order) => {
          if (order == null) {
            res.json({
              status: 'error',
              message: 'order not found',
            });
          } else {
            order.update({ order_status: ORDER_STATUSES.REJECTED });
            user.update({ can_order: true });
            res.json({ status: 'success' });
          }
        });
      }
    });
  },
  completeOrder: (req, res) => {
    const enrolment = req.body.enrolment;
    User.findOne({ where: { id: enrolment } }).then((user) => {
      if (user == null) {
        // res.status(404);
        res.json({
          status: 'error',
          message: 'user not found',
        });
      } else {
        Orders.findOne({
          where: { enrol_id: enrolment, order_status: ORDER_STATUSES.APPROVED },
        }).then((order) => {
          if (order == null) {
            res.json({
              status: 'error',
              message: 'approved order not found',
            });
          } else {
            order.update({ order_status: ORDER_STATUSES.COMPLETED });
            user.update({ can_order: true });
            res.json({ status: 'success' });
          }
        });
      }
    });
  },
  fetchAllApprovedOrPlaced: (req, res) => {
    Orders.findAll({
      where: {
        order_status: {
          [Op.or]: [ORDER_STATUSES.APPROVED, ORDER_STATUSES.PLACED],
        },
      },
    }).then((orders) => {
      res.json({ status: 'success', orders: orders });
    });
  },
  fetchAll: (req, res) => {
    Orders.findAll().then((orders) => {
      res.json({ status: 'success', orders: orders });
    });
  },
};
