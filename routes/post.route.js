// import express from 'express'
// import { addPost,getPosts,getPost,updatePost,deletePost, approvePost, rejectPost, getAllPosts, getMyPosts,} from '../controller/post.controller.js';
// import {auth, isAdmin} from "../middleware/auth.middleware.js"

// const route = express.Router();

// route.post('/add-post',auth,addPost)
// route.get('/get-posts', getPosts)
// route.get('/getall-posts',getAllPosts)
// route.get('/get-post/:post_id',getPost)
// route.get('/get-myposts',auth,getMyPosts)
// route.put('/update-post/:post_id',updatePost)
// route.delete('/delete-post/:post_id',deletePost)

// route.put('/approve-posts/:post_id',auth,isAdmin,approvePost)
// route.put('/reject-posts/:post_id',auth,isAdmin,rejectPost)
 
// export default route



import express from 'express';
import { addPost } from '../controller/post.controller.js';
import { upload } from "../utils/multer.utils.js";
import { auth } from "../middleware/auth.middleware.js";

const route = express.Router();

// FIX HERE – add multer in ROUTE
route.post(
  "/add-post",
  auth,
  upload.fields([{ name: "images", maxCount: 1 }]),
  addPost
);

export default route;
