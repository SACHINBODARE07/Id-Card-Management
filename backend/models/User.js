const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class User extends Model {}

User.init(
  {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    contactNumber: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    taluka: { type: DataTypes.STRING },
    village: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING, allowNull: true }, // Store file path
  },
  {
    sequelize,
    modelName: "User", // FIXED: Removed extra space
    tableName: "Users", // Optional: specify the table name
  }
);

module.exports = User;
