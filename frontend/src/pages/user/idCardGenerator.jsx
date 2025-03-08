import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const generateIDCard = async (user) => {
  try {
    // Generate HTML for the ID card
    const html = `
      <div id="id-card" style="width: 210mm; height: 297mm; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
          कार्यकर्ता ओळखपत्र
        </div>
        <div style="display: flex; justify-content: space-between;">
          <div>
            <img src="${user.profilepic}" alt="Profile" style="width: 100px; height: 130px; border: 1px solid #ddd;">
          </div>
          <div>
            <img src="${user.qrcodeimg}" alt="QR Code" style="width: 100px; height: 100px;">
            <div style="font-size: 10px; text-align: center;">Admin can scan QR to verify user</div>
          </div>
        </div>
        <div style="text-align: center; font-size: 18px; margin: 20px 0;">
          <h2>${user.fname} ${user.lname}</h2>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Department</td>
            <td style="border: 1px solid #ddd; padding: 8px;">Healthcare</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">State</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.state}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">District</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.district}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Taluka</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.taluka}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Village</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.village}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Emergency Contact</td>
            <td style="border: 1px solid #ddd; padding: 8px;">9990999998</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Blood Group</td>
            <td style="border: 1px solid #ddd; padding: 8px;">O+</td>
          </tr>
        </table>
        <div style="font-size: 10px; margin-bottom: 20px;">
          <p>
            <span style="color: orange;">📍</span>
            आद्य क्रांतीवीर राजे उमाजी नाईक,<br>
            क्षत्रिय रामवंशी संघटना,<br>
            मामलेदार कचेरी,<br>
            पुणे - ०२
          </p>
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="assets/img/sign.jpeg" alt="Signature" style="width: 70%; max-height: 40px;">
        </div>
        <div style="font-size: 10px;">
          <p>
            <span style="color: green;">✔</span>
            Verified member. Read and accepted Terms and conditions of membership.
          </p>
          <p>
            <span style="color: orange;">📍</span>
            Aadya Krantiveer Raje Umaji Naik,<br>
            Kashatriya Ramvanshi Sanghtana,<br>
            Mamledar Kacheri,<br>
            Pune-02
          </p>
        </div>
        <div style="text-align: center; font-size: 12px; font-weight: bold; margin-top: 20px;">
          <p>अप्पासाहेब गंगाराम चव्हाण (अध्यक्ष)</p>
        </div>
      </div>
    `;

    // Convert HTML to canvas
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const canvas = await html2canvas(container, { scale: 2 });
    document.body.removeChild(container);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

    // Return the PDF as a blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating ID card:', error);
    throw error;
  }
};

export default generateIDCard;