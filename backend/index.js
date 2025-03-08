const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const { sequelize, User, IDCardRequest } = require("./models"); // Import models and sequelize from models/index.js
const Admin = require("./models/Admin");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
// Sync all models with the database
sequelize
  .sync({ force: false }) // Set `force: true` to drop and recreate tables (use with caution)
  .then(() => {
    console.log("✅ Database & tables synced!");
  })
  .catch((err) => {
    console.error("❌ Error syncing database:", err);
  });

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Connected");
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
  }
});