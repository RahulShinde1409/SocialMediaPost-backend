import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
   description: {
      type: String,
    },
    
    images:{
      type: Array,
      default:[]
    },
    
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

   
  },
  { timestamps: true }
);

export default mongoose.model('post', postSchema);

