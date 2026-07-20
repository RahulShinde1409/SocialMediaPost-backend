import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
  });

  console.log("SMTP Response:", info.response);
  return info;
};

export default sendEmail;