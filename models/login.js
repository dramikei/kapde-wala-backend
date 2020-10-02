const Sequelize = require('sequelize');
const Model = Sequelize.Model;

const { sequelize } = require('../util/database');

class Login extends Model {}
Login.init(
  {
    // attributes

    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'login',
    timestamps: false,
    // options
  }
);

module.exports = Login;
