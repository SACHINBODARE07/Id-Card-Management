// models/IDCardRequest.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class IDCardRequest extends Model {}

IDCardRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idCardType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },
  },
  {
    sequelize,
    modelName: "IDCardRequest",
    tableName: "IDCardRequests",
  }
);

// Define associations
IDCardRequest.associate = (models) => {
  IDCardRequest.belongsTo(models.User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });
};

module.exports = IDCardRequest;