require('dotenv').config({ path: '../.env' });
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
  throw new Error('❌ Missing GMAIL_USER or GMAIL_APP_PASS in .env');
}

const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',                            
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

async function sendInStockEmail(toEmail, productUrl) {
  const mailOptions = {
    from: `"Target Stock Bot" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: '🛒 Your tracked item is in stock!',
    text: `Good news!\n\nThe item you're tracking is now in stock:\n${productUrl}\n\nCheck it out before it's gone.`,
    html: `<p>Good news!<br><br>
           The item you're tracking is <b>now in stock</b>:<br>
           <a href="${productUrl}">${productUrl}</a><br><br>
           — Target Stock Bot</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail}`);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

if (require.main === module) {
  const testEmail      = process.env.TEST_TO_EMAIL || process.env.GMAIL_USER;
  const testProductUrl = 'https://www.target.com/p/example-product';
  console.log('Using from email:', process.env.GMAIL_USER);
  sendInStockEmail(testEmail, testProductUrl);
}

module.exports = { sendInStockEmail };
