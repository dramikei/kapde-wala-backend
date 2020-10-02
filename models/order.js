const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const { sequelize } = require('../util/database');
const User = require('./user');

class Orders extends Model {}
Orders.init(
  {
    enrol_id: {
      type: Sequelize.STRING,
      references: {
        // This is a reference to another model
        model: User,
        // This is the column name of the referenced model
        key: 'id',
      },
    },
    order_status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    shirt_count: {
      type: Sequelize.INTEGER,
    },
    tshirt_count: {
      type: Sequelize.INTEGER,
    },
    pajama_count: {
      type: Sequelize.INTEGER,
    },
    jeans_count: {
      type: Sequelize.INTEGER,
    },
    pant_count: {
      type: Sequelize.INTEGER,
    },
    bedsheet_count: {
      type: Sequelize.INTEGER,
    },
    towel_count: {
      type: Sequelize.INTEGER,
    },
  },
  {
    sequelize,
    modelName: 'orders',
    timestamps: true,
  }
);

module.exports = Orders;
