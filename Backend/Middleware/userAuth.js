import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
      console.log("userAuth")
    const { token } = req.cookies;
    console.log(token)
    if (!token) {
      return res.status(402).json({
        success: false,
        message: "Not Authorized",
      });
    }
    
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    if (tokenDecoded.id) {
      req.userId = tokenDecoded.id;
    } else {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error on userAuth",
    });
  }
};


export default userAuth;