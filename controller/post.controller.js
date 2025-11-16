import postModel from "../models/post.model.js"
import { upload } from "../utils/multer.utils.js"
import fs from "fs";
import path from "path";


export const addPost = async (req, res) => {
    try {

        const addPost = upload.fields([{ name: 'images', maxCount: 1 }])

        addPost(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message, success: false })

            console.log(req.body, 'body');
            console.log(req.files, 'files')

            // let profile_img = req.files['profile_img'] ? req.files['profile_img'][0].filename : null;
            let images = req.files['images'] ? req.files['images'][0].filename : null;
            const { title, description } = req.body;

            const PostData = await postModel.create({
                title, description, images, author: req.user._id
            })

            if (PostData) {
                return res.status(201).json({
                    data: PostData,
                    message: "Post Added Successfully",
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






export const getPosts = async (req, res) => {
    try {
        const PostData = await postModel.find({ status: "approved" }).populate('author', ['name', 'profile_img'])
        if (PostData && PostData.length > 0) {
            return res.status(200).json({
                data: PostData,
                filePath: "http://localhost:3000/static/",
                count: PostData.length,
                message: "Fetched Approved Posts!",
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

// export const getAllPosts = async (req, res) => {
//     try {
//         const { status } = req.query;

//         const PostData = await postModel.find({ status: status }).populate("author", ["name", "profile_img"]);
//         return res.status(200).json({
//             data: PostData,
//             count: PostData.length,
//             message: "Fetched All Posts (Admin)",
//             success: true,
//         });
//     } catch (error) {
//         return res.status(500).json({ message: error.message, success: false });
//     }
// };



export const getAllPosts = async (req, res) => {
  try {
    const { status } = req.query;

    
    const query = status ? { status } : {};  

    const PostData = await postModel
      .find(query)
      .populate("author", ["name", "profile_img"]);

    return res.status(200).json({
      data: PostData,
      count: PostData.length,
      message: status 
        ? "Fetched Posts by Status (Admin)" 
        : "Fetched All Posts (Admin)",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};


export const getPost = async (req, res) => {
    try {
        const { post_id } = req.params;

        const PostData = await postModel.findOne({ _id: post_id });

        if (PostData) {
            return res.status(200).json({
                data: PostData,
                message: "Fetched my Post",
                success: true
            })
        }

        return res.status(400).json({
            message: "Post not found or not owned by you",
            success: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const getMyPosts = async (req, res) => {
    try {
        const PostData = await postModel.find({ author: req.user._id })
            .populate("author", ["name", "profile_img"]);

        return res.status(200).json({
            data: PostData,
            count: PostData.length,
            message: "Fetched My Posts!",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};


// export const updatePost = async (req, res) => {
//     try {
//         const MultipleFileData = upload.fields([
//             // { name: "profile_img", maxCount: 4 },
//             { name: "images", maxCount: 2 },
//         ]);

//         MultipleFileData(req, res, async function (err) {
//             if (err) return res.status(400).json({ error: err.message });

//             const { post_id } = req.params;
//             const {
//                 title, description, author

//             } = req.body;

//             const PostData = await postModel.findById(post_id);
//             if (!PostData) {
//                 return res.status(404).json({ message: "Post not found" });
//             }


//             // let updatedProfileImages = PostData.profile_img || [];
//             let updatedImages = PostData.images || [];

//             if (req.files && req.files["images"]) {

//                 PostData.images?.forEach((oldImg) => {
//                     const filePath = path.join("./uploads", oldImg);
//                     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//                 });

//                 updatedImages = req.files["images"].map(
//                     (file) => file.filename
//                 );
//             }

//             const updateResult = await postModel.updateOne(
//                 { _id: post_id },
//                 {
//                     $set: {
//                         title,
//                         description,
//                         author,
//                         // profile_img: updatedProfileImages,
//                         images: updatedImages,
//                     },
//                 }
//             );

//             if (updateResult.modifiedCount > 0) {
//                 return res.status(200).json({
//                     message: "Updated Post Successfully",
//                     success: true,
//                 });
//             }

//             return res.status(400).json({
//                 message: "Update failed or no changes made",
//                 success: false,
//             });
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Internal Server Error",
//             success: false,
//         });
//     }
// };

// export const updatePost = async (req, res) => {
//   try {
//     const { post_id } = req.params;
//     const { title, description, image } = req.body;

//     const updatedPost = await postModel.findByIdAndUpdate(
//       post_id,
//       { title, description, images: image },
//       { new: true }
//     );

//     if (!updatedPost) {
//       return res.status(404).json({ success: false, message: "Post not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Post Updated Successfully",
//       data: updatedPost,
//     });

//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };



export const updatePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { title, description } = req.body;

    // Find post first
    const post = await postModel.findById(post_id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    let images = post.images; // keep existing images

    // If user uploads NEW image
    if (req.file) {
      images = req.file.filename; // replace old image
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      post_id,
      { title, description, images },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Post Updated Successfully",
      data: updatedPost,
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};




export const deletePost = async (req, res) => {
    try {
        const { post_id } = req.params;

        const deletedPost = await postModel.deleteOne({ _id: post_id })

        if (deletedPost.deletedCount > 0) {
            return res.status(200).json({
                message: "Successfully Post Deleted!",
                success: true,
            })
        }

        return res.status(400).json({
            message: "Bad Request",
            success: false,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}




export const approvePost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const post = await postModel.findByIdAndUpdate(
            post_id,
            { status: "approved" },
            { new: true }
        );
        if (!post) return res.status(404).json({ message: "Post not found" });

        return res.json({ message: "Post approved", data: post, success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};


export const rejectPost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const post = await postModel.findByIdAndUpdate(
            post_id,
            { status: "rejected" },
            { new: true }
        );
        if (!post) return res.status(404).json({ message: "Post not found" });

        return res.json({ message: "Post rejected", data: post, success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
};