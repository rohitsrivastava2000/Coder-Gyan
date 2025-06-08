import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verifyOtp: {
    type: String,
    default: "",
  },
  verifyOtpExpireAt: {
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: "",
  },
  resetOtpExpiredAt: {
    type: Number,
    default: 0,
  },
  tempUserExpiredAt: {
    type: Date,
    default: null, // timestamp 2 min in future
    expires: 0, // expire exactly at that timestamp
  },
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
