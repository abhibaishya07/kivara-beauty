const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Use testing credentials or standard SMTP setup
  // Since we haven't configured a 3rd party email service for production yet, 
  // we'll try pulling from ENV variables, but if they are missing or fail, 
  // we ensure the logic doesn't fatally crash during user creation / password reset.

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || 'test_user',
      pass: process.env.SMTP_PASSWORD || 'test_password',
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Kivara Beauty'} <${process.env.FROM_EMAIL || 'noreply@kivarabeauty.in'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional HTML message
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Email sending failed (Note: Setup SMTP ENVs for real emails):', error.message);
    // Don't throw the error so the app continues gracefully in dev without full SMTP set up
    // console.log(`For development, your link is: \n\n${options.message}\n\n`);
  }
};

module.exports = sendEmail;
