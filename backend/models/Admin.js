const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Admin extends Model {}

Admin.init(
  {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    // role: { type: DataTypes.STRING, defaultValue: "admin" },
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "Admins", // Ensure this matches your DB table name
  }
);

module.exports = Admin;
