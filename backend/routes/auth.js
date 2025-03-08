const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { verifyToken, checkAdmin } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const idCardController = require("../controllers/idCardController"); // Ensure this file exists

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// User Routes
router.post("/register", upload.single("photo"), authController.register); // Register a new user
router.post("/login", authController.loginUser); // User login
router.get("/user-profile", verifyToken, authController.getUserProfile); // Get user profile
router.post("/request-password-change", authController.requestPasswordChange); // Request password change
router.post("/changePassword", verifyToken, authController.changePassword); // Change password
router.post("/reset-password/:userId/:token", authController.verifyTokenAndChangePassword); // Reset password
router.post("/signout", authController.signout); // User signout

// ID Card Routes
router.post("/idcard/request", verifyToken, idCardController.requestIDCard); // Request an ID card
router.get("/idcard/status", verifyToken, idCardController.getIDCardStatus); // Get ID card request status

// Admin Routes
router.get("/users", verifyToken, checkAdmin, authController.getAllUsers); // Get all users (admin only)
router.get("/users/:id", verifyToken, checkAdmin, authController.getUserById); // Get user by ID (admin only)
router.delete("/user/:id", verifyToken, checkAdmin, authController.deleteUser); // Delete a user (admin only)
router.put("/user/:id/role", verifyToken, checkAdmin, authController.updateUserRole); // Update user role (admin only)
router.get("/idcard/requests", verifyToken, checkAdmin, idCardController.getAllIDCardRequests); // Get all ID card requests (admin only)
router.put("/idcard/requests/:id", verifyToken, checkAdmin, idCardController.updateIDCardRequestStatus); // Update ID card request status (admin only)
router.post("/idcard/generate/:userId", verifyToken, checkAdmin, idCardController.generateIDCard); // Generate ID card (admin only)

module.exports = router;