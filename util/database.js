const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/db.sqlite',
});

const ORDER_STATUSES = {
  PLACED: 'placed',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

module.exports = { sequelize, ORDER_STATUSES };
