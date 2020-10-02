const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const { sequelize } = require('../util/database');

class User extends Model {}
User.init(
  {
    // attributes
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
    roomNo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    can_order: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'user',
    timestamps: false,
    // options
  }
);

module.exports = User;
