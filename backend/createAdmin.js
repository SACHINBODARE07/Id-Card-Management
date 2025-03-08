const bcrypt = require("bcryptjs");
const { Admin } = require("./models"); // FIXED: Ensure correct import

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("adminpassword", 10);
    await Admin.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: hashedPassword,
      // role: "admin",
    });
    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};

createAdmin();
