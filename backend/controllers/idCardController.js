const { IDCardRequest, User } = require("../models");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

// Request ID Card
exports.requestIDCard = async (req, res) => {
  try {
    const { idCardType, issueDate, expiryDate } = req.body;
    const userId = req.user.id;

    const newRequest = await IDCardRequest.create({
      userId,
      idCardType,
      issueDate,
      expiryDate,
      status: "Pending",
    });

    res.status(201).json({ success: true, message: "ID Card request submitted successfully", request: newRequest });
  } catch (error) {
    console.error("Error submitting ID card request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get ID Card Status
exports.getIDCardStatus = async (req, res) => {
  try {
    const requests = await IDCardRequest.findAll({ where: { userId: req.user.id } });
    res.json(requests);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Get All ID Card Requests (Admin Only)
exports.getAllIDCardRequests = async (req, res) => {
  try {
    const requests = await IDCardRequest.findAll({
      include: [{ model: User, attributes: ["id", "firstName", "lastName", "email", "contactNumber"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error("Error fetching ID Card Requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update ID Card Request Status (Admin Only)
exports.updateIDCardRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["Pending", "Approved", "Rejected", "deleted"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const request = await IDCardRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await request.update({ status });
    res.status(200).json({ message: "Request updated successfully", updatedRequest: request });
  } catch (error) {
    console.error("Error updating ID card request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Generate ID Card (Admin Only)
exports.generateIDCard = async (req, res) => {
  const { userId } = req.params;

  try {
    const request = await IDCardRequest.findOne({ where: { userId, status: "Approved" } });
    if (!request) {
      return res.status(404).json({ message: "No approved ID card request found for this user." });
    }

    const filePath = await generateIDCardPDF(userId);
    res.download(filePath, `IDCard_${userId}.pdf`, (err) => {
      if (err) {
        console.error("Error downloading ID card:", err);
        res.status(500).send("Error downloading ID card.");
      }
    });
  } catch (error) {
    console.error("Error generating ID card:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Generate ID Card PDF
const generateIDCardPDF = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../uploads/IDCard_${userId}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  // Add ID Card content
  doc.fontSize(25).text("ID Card", { align: "center" });
  doc.fontSize(15).text(`Name: ${user.firstName} ${user.lastName}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Contact: ${user.contactNumber}`);
  doc.text(`State: ${user.state}`);
  doc.text(`District: ${user.district}`);
  doc.text(`Taluka: ${user.taluka}`);
  doc.text(`Village: ${user.village}`);
  doc.end();

  return filePath;
};