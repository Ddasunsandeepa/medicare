const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "test@test.com",
    pass: "test",
  },
});

const sendEmail = (to, subject, text) => {
  console.log(`Email sent to ${to}: ${subject}`);
};

module.exports = sendEmail;
