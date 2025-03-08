const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { User, PasswordResetToken } = require("../models");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register User
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber, state, district, taluka, village, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !contactNumber || !password) {
      return res.status(400).json({ success: false, message: "All required fields must be filled." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle file upload
    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    }

    // Create user in database
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      state,
      district,
      taluka,
      village,
      password: hashedPassword,
      photo: photoPath,
    });

    return res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Request Password Change
exports.requestPasswordChange = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a unique token
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = Date.now() + 3600000; // Token valid for 1 hour

    // Save token in the database
    await PasswordResetToken.create({ userId: user.id, token, expiration });

    // Send email with the reset link
    const link = `${process.env.BASE_URL}/reset-password/${user.id}/${token}`;
    await sendEmail(user.email, "Password Change Request", `Click this link to change your password: ${link}`);

    res.status(200).json({ message: "Password change link sent to your email" });
  } catch (error) {
    console.error("Error sending password change email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify Token and Change Password
exports.verifyTokenAndChangePassword = async (req, res) => {
  const { userId, token } = req.params;
  const { newPassword } = req.body;

  try {
    const passwordResetToken = await PasswordResetToken.findOne({ where: { userId, token } });
    if (!passwordResetToken || passwordResetToken.expiration < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await User.findByPk(userId);
    await user.update({ password: hashedPassword });

    // Cleanup: Remove the token
    await passwordResetToken.destroy();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Password Change Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Signout
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signed out successfully" });
};

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "email", "contactNumber", "state", "district", "taluka", "village", "role"],
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete User (Admin Only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.destroy();
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update User Role (Admin Only)
exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ role });
    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get User by ID (Admin Only)
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ["id", "firstName", "lastName", "email", "contactNumber", "state", "district", "taluka", "village", "role"],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};