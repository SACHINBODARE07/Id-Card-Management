const jwt = require("jsonwebtoken");

// Verify Token Middleware
exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(400).json({ success: false, message: "Invalid token." });
  }
};

// Check Admin Middleware
exports.checkAdmin = (req, res, next) => {
  const user = req.user; // Assuming req.user is set by verifyToken middleware
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};