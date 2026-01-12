const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify((error, success) => {
  if (error) console.error(error);
  else console.log("Email server is ready");
});

exports.sendAppointmentEmail = async ({ to, name, doctor, date, time }) => {
  await transporter.sendMail({
    from: "MWN Clinic <no-reply@mwn.com>",
    to,
    subject: "Appointment Confirmation",
    html: `
      <h3>Appointment Confirmed</h3>
      <p>Dear ${name},</p>
      <p>Your appointment has been booked successfully.</p>
      <ul>
        <li><b>Doctor:</b> ${doctor}</li>
        <li><b>Date:</b> ${date}</li>
        <li><b>Time:</b> ${time}</li>
      </ul>
      <p>Thank you,<br/>MWN Clinic</p>
    `,
  });
};

exports.sendPaymentEmail = async ({ to, name, packageName, amount }) => {
  await transporter.sendMail({
    from: "MWN Clinic <no-reply@mwn.com>",
    to,
    subject: "Payment Confirmation",
    html: `
      <h3>Payment Successful</h3>
      <p>Dear ${name},</p>
      <p>Your payment has been received successfully.</p>

      <ul>
        <li><b>Package:</b> ${packageName}</li>
        <li><b>Total Paid:</b> Rs.${amount}</li>
      </ul>

      <p>You can now book appointments using this package.</p>
      <p>Thank you,<br/>MWN Clinic</p>
    `,
  });
};
