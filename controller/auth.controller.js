import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from "../models/user.model.js";
import postModel from '../models/post.model.js';
// import nodemailer from 'nodemailer';

export const Register = async (req, res) => {
  try {
    // console.log("Received at backend:", req.body);
    const { name, email, password, contact } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        message: "User already exist!",
        success: false
      })
    }

    const hashPassword = bcrypt.hashSync(password, parseInt(process.env.PASSWORD_SALT || "12"))

    const created = await userModel.create({ name, email, password: hashPassword, contact, role:"user" })
    if (created) {
      return res.status(201).json({
        message: "Registered Successfully!",
        success: true,
        user: {
        _id: created._id,
        name: created.name,
        email: created.email,
        role: created.role
      }
      })
    }

    return res.status(400).json({
      message: "Bad Request",
      success: false
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    })
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        message: "User doesn't exist!",
        success: false
      });
    }

    const checkPassword = bcrypt.compareSync(password, existingUser.password);
    const { password: _, ...user } = existingUser.toObject();

    const posts = await postModel.find({ user_id: existingUser._id });

    if (checkPassword) {
       if (!existingUser.role) {
        existingUser.role = "user";
        await existingUser.save();
        user.role = "user"; 
      }

      const token = jwt.sign(
        { data: { id: existingUser._id,role: existingUser.role } },
        process.env.TOKEN_SECRET_KEY,
        { expiresIn: '1d' }
      );
      return res.status(200).json({
        data: user,
        token,
        message: "Successfully login!",
        success: true,
        posts
      });
    }

    
    return res.status(400).json({
      message: "Invalid password!",
      success: false
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};



// export const SendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email)
//       return res.status(404).json({ message: "Please provide Email" });
//     const user = await userModel.findOne({ email: email });

//     if (!user) return res.status(404).json({ message: "User doesn't exist" });

//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const expiryTime = new Date();
//     expiryTime.setMinutes(expiryTime.getMinutes() + 2);

//     const send = await userModel.updateOne(
//       { email: email },
//       {
//         $set: {
//           // email:email,
//           otp: otp,
//           otpExpiry: expiryTime
//         }
//       }
//     );
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       secure: true,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     //send mails
//     const mailOptions = {
//       from: process.env.EMAIL_USER, 
//       to: user.email, 
//       subject: "Otp Send ",
//       html: `<p>Otp is
//       : ${otp}</p>`,
//     };

//     await transporter.sendMail(mailOptions);

//     return res
//       .status(200)
//       .json({ message: "Otp has been send to your email" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message, success: false });
//   }
// };

// export const verifyOTP = async (req, res) => {
//   try {
//     const { otp, email } = req.body;

//     if (!otp || !email) {
//       return res.status(400).json({ message: "Email and OTP are required." });
//     }

//     const user = await userModel.findOne({ email: email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     if (parseInt(otp) !== user.otp) {
//       return res.status(400).json({ message: "Invalid OTP." });
//     }

//     if (new Date() > new Date(user.otpExpiry)) {
//       return res.status(410).json({ message: "OTP expired." });
//     }

//     await userModel.updateOne(
//       { email: email },
//       { $unset: { otp: "", otpExpiry: "" } }
//     );

//     return res.status(200).json({ message: "OTP verified successfully." });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error." });
//   }
// };

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(404).json({ message: "Please provide Email" });

    const user = await userModel.findOne({ email: email });

    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    
    const resetToken = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "15m",
    });

    
    const resetLink = `${process.env.CLIENT_URL}/reset-pass/${resetToken}`;

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   const mailOptions = {
  from: process.env.EMAIL_USER,
  to: user.email,
  subject: "Password Reset Request",
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Password Reset</h2>
      <p>Click the button below to reset your password. This link will expire in 15 minutes.</p>
      
      <a href="${resetLink}" target="_blank"
         style="display:inline-block; padding:12px 20px; margin-top:10px;
                background-color:#007bff; color:#fff; font-weight:bold; 
                text-decoration:none; border-radius:5px;">
        Reset Password
      </a>

      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `,
};


    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Reset link has been sent to your email" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.PASSWORD_SALT));

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};


