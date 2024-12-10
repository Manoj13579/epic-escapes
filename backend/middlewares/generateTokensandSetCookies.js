import {
    accessTokenExpiryDate,
    refreshTokenExpiryDate,
  } from "../config/tokenExpiry.js";
  import jwt from "jsonwebtoken";



const generateTokensAndSetCookies = async (user, res) => {
    
    
    const accessToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessTokenExpiryDate }
    );
  
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
  
    const refreshToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: refreshTokenExpiryDate }
    );
  
    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();
  
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    });
  
    return { accessToken, refreshToken };
  };

  
  export default generateTokensAndSetCookies;