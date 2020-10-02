const Sequelize = require('sequelize');

const User = require('../models/user');
const Orders = require('../models/order');


const { ORDER_STATUSES } = require('../util/database');

const Op = Sequelize.Op;

module.exports = {
  fetchUser: (req, res) => {
    const enrolment = req.body.enrolment.toLowerCase();
    User.findOne({ where: { id: enrolment } }).then((user) => {
      if (user == null) {
        // res.status(404);
        res.json({
          status: 'error',
          message: 'user not found',
        });
      } else {
        Orders.findAll({ where: { enrol_id: enrolment } }).then((orders) => {
          res.json({
            status: 'success',
            orders: orders,
          });
        });
      }
    });
  },
  getStatus: (req, res) => {
    const enrolment = req.body.enrolment.toLowerCase();
    User.findOne({ where: { id: enrolment } }).then((user) => {
      if (user == null) {
        // res.status(404);
        res.json({
          status: 'error',
          message: 'user not found',
        });
      } else {
        Orders.findAll({
          limit: 1,
          where: {
            enrol_id: enrolment,
            order_status: {
              [Op.or]: [
                ORDER_STATUSES.PLACED,
                ORDER_STATUSES.APPROVED,
                ORDER_STATUSES.COMPLETED,
              ],
            },
          },
          order: [['createdAt', 'DESC']],
        }).then((orders) => {
          res.json({ status: 'success', order: orders[0] });
        });
      }
    });
  },
  createOrder: (req, res) => {
    const enrolment = req.body.enrolment.toLowerCase();

    User.findOne({ where: { id: enrolment } }).then((user) => {
      if (user == null) {
        // res.status(404);
        res.json({
          status: 'error',
          message: 'user not found',
        });
      } else if (user.can_order == true) {
        const shirt = req.body.shirt;
        const tshirt = req.body.tshirt;
        const pajamas = req.body.pajamas;
        const jeans = req.body.jeans;
        const pants = req.body.pants;
        const bedsheets = req.body.bedsheets;
        const towels = req.body.towels;

        Orders.create({
          enrol_id: enrolment,
          shirt_count: shirt,
          tshirt_count: tshirt,
          pajama_count: pajamas,
          jeans_count: jeans,
          pant_count: pants,
          bedsheet_count: bedsheets,
          towel_count: towels,
          order_status: ORDER_STATUSES.PLACED,
        });
        user.update({ can_order: false });
        res.status(201);
        res.json({ status: 'success' });
      } else {
        //  res.status(500);
        res.json({
          status: 'error',
          message: 'order already pending',
        });
      }
    });
  },
  cancelOrder: (req, res) => {
    const enrolment = req.body.enrolment.toLowerCase();
    User.findOne({ where: { id: enrolment } }).then((user) => {
      if (user == null) {
        // res.status(404);
        res.json({
          status: 'error',
          message: 'user not found',
        });
      } else {
        // Orders.destroy({where: {enrol_id: enrolment}, truncate: true, restartIdentity: true}).then(success => {
        //     user.update(({can_order: true}));
        //     res.json({"status":"success"});
        // });
        Orders.findOne({
          where: { enrol_id: enrolment, order_status: ORDER_STATUSES.PLACED },
        }).then((order) => {
          order.update({ order_status: ORDER_STATUSES.CANCELLED });
          user.update({ can_order: true });
          res.json({ status: 'success' });
        });
      }
    });
  },
};
