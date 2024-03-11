import mongoose from "mongoose";

// Creating a Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Names are required"],
  },
  email: {
    type: String,
    required: [true, "Emails are required"],
  },
  role: {
    type: String,
    enum: ["Admin", "Author", "Guest"], 
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blogs",
    },
  ],
});

// Creating a User model based on the userSchema
const User = mongoose.model('User', userSchema);
export default User;
