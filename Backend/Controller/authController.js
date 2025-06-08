import User from "../Model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailSender from "../Utils/mailSender.js";
import otpGenerator from "otp-generator";

//User Registration
export const register = async (req, res) => {
  try {
    console.log(req.body);
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res.status(200).json({
        success: false,
        message: "All Field Are Mandatory",
      });
    }

    const checkUserName = await User.findOne({ userName: userName });

    if (checkUserName) {
      return res.status(402).json({
        success: false,
        message: "User Name Already Exist, try another",
      });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(404).json({
        success: false,
        message: "User Already register, Please go for login",
      });
    }

    //Sending the verification otp
    let otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    //Sending mail
    const mailOption = {
      email: email,
      title: "Email Verification, OTP Expire within 1 hour",
      body: otpCode,
    };

    await mailSender(mailOption);

    const hashPassword = await bcrypt.hash(password, 10);

    const userData = new User({
      userName,
      email,
      password: hashPassword,
      verifyOtp: otpCode,
      verifyOtpExpireAt: Date.now() + 1 * 60 * 60 * 1000,
      tempUserExpiredAt: new Date(Date.now() + 2 * 60 * 1000)
    });

    await userData.save();

    const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    console.log("register");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "OTP Send Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error on Register Phase",
    });
  }
};

//User Login
export const login = async (req, res) => {
  try {
    console.log("yes i am Login");
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "All Field are Mandatory",
      });
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(402).json({
        success: false,
        message: "User is not Register",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(402).json({
        success: false,
        message: "Invalid Password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User Login Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error on Login Phase",
    });
  }
};

//User Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error on Logout",
    });
  }
};




//verify otp
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId=req.userId;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Missing Details",
      });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(402).json({
        success: false,
        message: "User Not Found",
      });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(404).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(406).json({
        success: false,
        message: "OTP Expired",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await User.updateOne(
      { _id: user._id },
      { $unset: { tempUserExpiredAt: "" } }
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Registration Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error on verifyEmail",
    });
  }
};

//check user is authenticated or not
export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({
      success:true
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error on isAuthenticated",
    });
  }
};

//send password reset otp
export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("sendResetOtp");
    if (!email) {
      return res.status(402).json({
        success: false,
        message: "Email Id is missing ",
      });
    }
    console.log(email);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not Found",
      });
    }
    let otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    user.resetOtp = otpCode;
    user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    //Sending mail
    const mailOption = {
      email: user.email,
      title: "Reset OTP , Expire within 15min",
      body: otpCode,
    };

    await mailSender(mailOption);

    return res.status(200).json({
      success: true,
      message: "OTP send to you email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server Error on sendResetOtp",
    });
  }
};

//Reset User Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log(otp);
    if (!email || !otp || !newPassword) {
      return res.status(404).json({
        success: false,
        message: "Email, OTP and New Password is required",
      });
    }

    const user = await User.findOne({ email });
    console.log("resetPassword");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(402).json({
        success: false,
        message: "OTP not match",
      });
    }
    if (user.resetOtpExpiredAt < Date.now()) {
      return res.status(406).json({
        success: false,
        message: "OTP Expired",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;
    user.resetOtp = "";
    user.resetOtpExpiredAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error on resetPassword",
    });
  }
};
