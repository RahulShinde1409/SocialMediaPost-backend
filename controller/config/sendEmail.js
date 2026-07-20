import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Sending email to:", options.email);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    console.log("SUCCESS:", info.response);
  } catch (error) {
    console.log("EMAIL ERROR:");
    console.log(error);
  }
};

export default sendEmail;