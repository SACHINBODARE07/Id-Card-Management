const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Import models
const User = require("./User");
const IDCardRequest = require("./IDCardRequest");
const Admin = require("./Admin");

// Initialize database object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Assign models
db.User = User;
db.IDCardRequest = IDCardRequest;
db.Admin = Admin;

// Sync models
db.sequelize.sync({ force: false });

User.hasMany(IDCardRequest, { foreignKey: 'userId', onDelete: 'CASCADE' });
IDCardRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = db;
