import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js';


export const auth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9......

      const token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      console.log(decoded);
      const userData = await userModel
        .findOne({ _id: decoded.data.id })
        .select("-password");

      req.user = userData;
      console.log(userData)
      if (decoded) {
        next();
      } else {
        return res.status(401).json({
          message: "Invalid token",
        });
      }
    } else {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const isAdmin = async (req, res, next) => {
    try {
       console.log("User from token:", req.user);
        if (req.user.role === 'admin') {
            return next();
        } else {
            return res.status(403).json({
                message: "You don't have permission to perform this action",
                success: false
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message,
            success: false,
        })
    }
}