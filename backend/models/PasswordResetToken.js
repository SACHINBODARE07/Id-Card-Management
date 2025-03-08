const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

class PasswordResetToken extends Model {}

PasswordResetToken.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Adjust if your User model is named differently
      key: 'id'
    }
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiration: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'PasswordResetToken',
  tableName: 'password_reset_tokens', // Adjust the table name as necessary
  timestamps: false
});

module.exports = PasswordResetToken;