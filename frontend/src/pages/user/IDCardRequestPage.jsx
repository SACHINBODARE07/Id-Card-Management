import React, { useState } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const IDCardRequestPage = ({ user, idCardRequests }) => {
  const [message, setMessage] = useState('');
  const [idCardType, setIdCardType] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication required. Please log in.');
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/auth/idcard/request',
        {
          idCardType,
          issueDate,
          expiryDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message || 'Request submitted!');
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to submit request.');
    }
  };

  const generateIDCardPDF = async () => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([350, 200]); // ID card size

      // Embed fonts
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Add user details to the PDF
      const { width, height } = page.getSize();
      page.drawText('ID Card', { x: 50, y: height - 30, size: 20, font, color: rgb(0, 0, 0) });
      page.drawText(`Name: ${user.firstName} ${user.lastName}`, { x: 50, y: height - 60, size: 12, font, color: rgb(0, 0, 0) });
      page.drawText(`Email: ${user.email}`, { x: 50, y: height - 80, size: 12, font, color: rgb(0, 0, 0) });
      page.drawText(`Contact: ${user.contactNumber}`, { x: 50, y: height - 100, size: 12, font, color: rgb(0, 0, 0) });
      page.drawText(`Address: ${user.state}, ${user.district}, ${user.taluka}, ${user.village}`, { x: 50, y: height - 120, size: 12, font, color: rgb(0, 0, 0) });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();

      // Trigger download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `IDCard_${user.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating ID card:', error);
      setMessage('Failed to generate ID card.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">ID Card Request</h2>
      <div>
        <label>ID Card Type:</label>
        <input
          type="text"
          value={idCardType}
          onChange={(e) => setIdCardType(e.target.value)}
          className="border p-2 mb-2"
        />
      </div>
      <div>
        <label>Issue Date:</label>
        <input
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          className="border p-2 mb-2"
        />
      </div>
      <div>
        <label>Expiry Date:</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="border p-2 mb-2"
        />
      </div>
      <button
        onClick={handleRequest}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Request ID Card
      </button>
      {message && <p className="mt-2 text-green-500">{message}</p>}

      <h3 className="text-xl font-bold mt-4">ID Card Requests Status</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID Card Type</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {idCardRequests.length > 0 ? (
            idCardRequests.map((request) => (
              <tr key={request.id} className="border">
                <td className="p-2 border">{request.idCardType}</td>
                <td className="p-2 border">{request.status}</td>
                <td className="p-2 border">
                  {request.status === 'Approved' && (
                    <button
                      onClick={generateIDCardPDF}
                      className="bg-blue-500 text-white px-2 py-1 rounded flex items-center"
                    >
                      <Download className="mr-2" /> Download ID Card
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-2 text-center">
                No ID card requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IDCardRequestPage;