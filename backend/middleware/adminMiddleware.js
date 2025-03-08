// middleware/adminMiddleware.js
const jwt = require("jsonwebtoken");

exports.verifyAdminToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};