const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, User, IDCardRequest } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, admin });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'contactNumber'],
    });
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all ID card requests (admin only)
exports.getAllIDCardRequests = async (req, res) => {
  try {
    const requests = await IDCardRequest.findAll({
      include: [{ model: User, attributes: ['id', 'firstName', 'lastName', 'email', 'contactNumber'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ requests });
  } catch (error) {
    console.error('Error fetching ID card requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update ID card request status (admin only)
exports.updateIDCardRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = await IDCardRequest.findByPk(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    await request.update({ status });
    res.json({ message: 'Request updated successfully', request });
  } catch (error) {
    console.error('Error updating ID card request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate ID card PDF (admin only)
exports.generateIDCard = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../uploads/IDCard_${userId}.pdf`);
    doc.pipe(fs.createWriteStream(filePath));

    // Add ID Card content
    doc.fontSize(25).text('ID Card', { align: 'center' });
    doc.fontSize(15).text(`Name: ${user.firstName} ${user.lastName}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Contact: ${user.contactNumber}`);
    doc.text(`State: ${user.state}`);
    doc.text(`District: ${user.district}`);
    doc.text(`Taluka: ${user.taluka}`);
    doc.text(`Village: ${user.village}`);
    doc.end();

    res.download(filePath, `IDCard_${userId}.pdf`, (err) => {
      if (err) {
        console.error('Error downloading ID card:', err);
        res.status(500).send('Error downloading ID card.');
      } else {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.error('Error deleting file:', unlinkErr);
        });
      }
    });
  } catch (error) {
    console.error('Error generating ID card:', error);
    res.status(500).json({ message: 'Server error' });
  }
};