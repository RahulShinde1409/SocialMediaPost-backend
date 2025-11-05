import userModel from "../models/user.model.js";
import { upload } from "../utils/multer.utils.js";
import path from "path";
import fs from "fs";
import bcrypt from 'bcrypt';

export const addUser = async (req, res) => {
    try {

        const addUserWithFile = upload.fields([{ name: 'profile_image', maxCount: 1 }])

        addUserWithFile(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message, success: false })

            console.log(req.body, 'body');
            console.log(req.files, 'files')

            let profile_image = req.files['profile_image'] ? req.files['profile_image'][0].filename : null;
            const { name, email, password, contact} = req.body
            const role = req.body.role || "user";


            const hashedPassword = bcrypt.hashSync(password, 10);

            const userData = await userModel.create({
                name, email, password: hashedPassword, contact, role, profile_image
            })

            if (userData) {
                return res.status(201).json({
                    data: userData,
                    message: "User Added Successfully",
                    success: true
                })
            }
            return res.status(400).json({
                message: "Bad Request",
                success: false
            })
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const getUsers = async (req, res) => {
    try {
        
        const userData = await userModel.find()

        if (userData) {
            return res.status(200).json({
                data: userData,
                count: userData.length,
                message: "Fetched!",
                success: true
            })
        }

        return res.status(400).json({
            message: "Bad Request",
            success: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const getUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const userData = await userModel.findOne({ _id: user_id });

        if (userData) {
            return res.status(200).json({
                data: userData,
                message: "Fetched!",
                success: true
            })
        }

        return res.status(400).json({
            message: "Bad Request",
            success: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const updateUser = async (req, res) => {
  try {
    const MultipleFileData = upload.fields([
      { name: "profile_image", maxCount: 1 },
    ]);

    MultipleFileData(req, res, async function (err) {
      if (err) return res.status(400).json({ error: err.message });

      const { user_id } = req.params;
      const { name, email, password, contact, role } = req.body;

      const profileData = await userModel.findOne({ _id: user_id });

      
      const profile_image = req.files["profile_image"]
        ? req.files["profile_image"][0].filename
        : profileData.profile_image;

      
      if (req.files["profile_image"]) {
        const oldFile = profileData.profile_image;

        
        if (oldFile && typeof oldFile === "string" && oldFile.trim() !== "") {
          const oldImagePath = path.join("./uploads", oldFile);

          if (
            fs.existsSync(oldImagePath) &&
            fs.lstatSync(oldImagePath).isFile()
          ) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      const updateUser = await userModel.updateOne(
        { _id: user_id },
        {
          $set: {
            name: name,
            email: email,
            password: password,
            contact: contact,
            role: role,
            profile_image: profile_image,
          },
        }
      );

      if (updateUser.modifiedCount > 0) {
        return res.status(200).json({
          message: "Updated User Successfully",
          success: true,
        });
      }
      return res.status(400).json({
        message: "Something Went Wrong",
        success: false,
      });
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteUser = async (req, res) => {
    try {

        const { user_id } = req.params;
        const deletedUser = await userModel.deleteOne({ _id: user_id });

        if (deletedUser.deletedCount > 0) {
            return res.status(200).json({
                message: "User Deleted Successfully!",
                success: true
            })
        }

        return res.status(400).json({
            message: "Bad Request",
            success: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}