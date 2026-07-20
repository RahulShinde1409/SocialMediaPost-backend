import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify Gmail SMTP connection
    await transporter.verify();
    console.log("✅ SMTP Login Successful");

    const info = await transporter.sendMail({
      from: `"Social Feed App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset</h2>
          <p>You requested to reset your password.</p>
          <p>
            <a href="${message}" target="_blank"
               style="background:#007bff;color:#fff;padding:10px 18px;
               text-decoration:none;border-radius:5px;">
               Reset Password
            </a>
          </p>
          <p>If the button doesn't work, copy this link:</p>
          <p>${message}</p>
          <p>This link will expire in 15 minutes.</p>
        </div>
      `,
    });

    console.log("✅ Email Sent:", info.response);

    return info;
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
};

export default sendEmail;