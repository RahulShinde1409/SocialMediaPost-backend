import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        default: null
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    profile_image: {
        type: Array,
        default: []
    },
    otp: {
        type: Number,
        default: null
    },
    otpExpiry: {
        type: Number,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model('user', userSchema)