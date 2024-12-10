import Users from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateTokensAndSetCookies from "../middlewares/generateTokensandSetCookies.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../middlewares/sendEmail/email.js";



const register = async (req, res) => {
  const { firstName, lastName, email, password, role, image: photo } = req.body.updatedFormData;


  try {
    if (!firstName || !lastName || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }
    let existingUser = await Users.findOne({ email, authProvider: "jwt" });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();// random 6 digit

    const newUser = new Users({ firstName, lastName,
      role,
      email,
      password: hashedPassword,
       authProvider: "jwt",
       photo,
      verificationCode,
      verificationCodeExpiresAt:Date.now() + 1 * 60 * 60 * 1000, //1 hour
     });
    await newUser.save();
    await sendVerificationEmail(newUser.email, verificationCode);
    return res.status(201).json({
      success: true,
      message: "verification code has been sent to your email. Please enter the code to verify your account.",
      _id: newUser._id
    });
  } catch (error) {
    console.error('register error', error);
    return res.status(500).json({ success: false, error });
  }
};



const login = async (req, res) => {
  const { email, password} = req.body;
  
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }
  try {
    const user = await Users.findOne({ email, authProvider: "jwt" });
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Wrong email or password" });
    }
    if(!user.isVerified){
      return res
        .status(403)
        .json({ success: false, message: "email not verified" });
    }
    if(user.lockLoginUntil && user.lockLoginUntil >= Date.now()){
      return res
        .status(403)
        .json({ success: false, message: "Account Locked! try again later" });
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      // increment login attempts
      user.loginAttempts += 1;
      // Lock the account if attempts exceed the maximum limit
      if (user.loginAttempts >= 6) {
        user.lockLoginUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Lock for 1 day
        user.loginAttempts = 0; // Reset login attempts after locking
      }
     await user.save();
      return res
        .status(403)
        .json({ success: false, message: "Wrong email or password" });
    }
 await generateTokensAndSetCookies(
      user,
      res
    );
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      /* like this mongodb won't pass _id by default but if entire user passed or like res in adminProfileEdit _id is passed by default */
      user: {
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        authProvider: "jwt",
        _id: user._id,
        image: user.photo,
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};



const refreshRequest = async (req, res) => {
  const { refreshToken } = req.cookies;
 
  try {
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "no refreshToken" });
    }

    const user = await Users.findOne({ refreshToken });
    if (!user) {
     return  res.status(400).json({ success: false, message: "invalid user" });
    }
// decoded is not a Mongoose object, but rather a plain object with JWT payload.
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        console.log('refreshRequest', decoded);
        if (err) {
          return res.status(403).json({ success: false, message: "insufficient permission" });
        }
       // Now retrieve the user using the decoded payload. more secure than passing user
       
       const refreshedUser = await Users.findById(decoded._id); // Use decoded id
      
       if (!refreshedUser) {
         return res.status(403).json({ success: false, message: "User not found" });
       }

       await generateTokensAndSetCookies(
         refreshedUser, // Pass the full user instance here
         res
       );

        return res.status(200).json({
          success: true,
          message: "new accessToken generated",
        });
      }
    );
  } 
  catch (error) {
    console.error(error);
    
    return res.status(500).json({ success: false, error });
  }
};



const logout = async (req, res) => {
  
  const { refreshToken } = req.cookies;
  
  
  if(!refreshToken) {
   return  res.status(400).json({ success: false, message: "refreshToken not found"})
  }
    try {
      await Users.findOneAndUpdate({ refreshToken }, { refreshToken: null });
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ success: true, message: "successfully logged out" });
    } 
    catch (error) {
      return res.status(500).json({ success: false, error });
    }
  };



  const resendVerificationCode = async (req, res) => {
    
    const { _id } = req.body;
    try {
        const user = await Users.findById(_id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "You are already verified" });
        }

        // Check if the user is in the lock period
        if (user.lockVerificationResendUntil && user.lockVerificationResendUntil >= Date.now()) {
            return res.status(403).json({ success: false, message: "Maximum resend attempts reached, try again later" });
        }

        if (user.verificationResendAttempts >= 3) {
            user.lockVerificationResendUntil = Date.now() + 24 * 60 * 60 * 1000; // Lock for 1 day
            user.verificationResendAttempts = 0;
            await user.save();
            return res.status(403).json({ success: false, message: "Maximum resend attempts reached" });
        }

        const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = newVerificationCode;
        user.verificationCodeExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour expiration
        user.verificationResendAttempts += 1;

        await user.save();
        await sendVerificationEmail(user.email, newVerificationCode);

        return res.status(200).json({
            success: true,
            message: "New verification code sent to your email",
        });
    } catch (error) {
        console.error("resendVerificationCode error", error);
        return res.status(500).json({ success: false, error });
    }
};




  const verificationCode = async (req, res)=>{
    
    const { verificationCode, _id }=req.body;
    if(!verificationCode) {
      return res.status(404).json({success:false,message:"verification code not found"})
    } 
    try {
      const user= await Users.findOne({
        _id,
        verificationCodeExpiresAt:{$gt:Date.now()}
      })
      if(user.lockVerificationCodeUntil && user.lockVerificationCodeUntil >= Date.now()) {
        return res.status(403).json({ success: false, message: "Maximum resend attempts reached, try again later" });
      }
      if (!user) {
        return res.status(404).json({success:false,message:"user not found or code expired"})
        
      };
      if (user.verificationCode !== verificationCode) {
        user.verificationCodeAttempts += 1;
       // Lock the account if attempts exceed the maximum limit
      if (user.verificationCodeAttempts >= 3) {
        user.lockVerificationCodeUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Lock for 1 day
        user.verificationCodeAttempts = 0; // Reset login attempts after locking
      }
     await user.save();
        return res.status(400).json({success:false,message:"Inavlid or Expired Code"})
        
      };
     user.isVerified=true;
     user.verificationCode=undefined;
     user.verificationCodeExpiresAt=undefined;
   const verifiedUser =  await user.save();
   
     await sendWelcomeEmail(verifiedUser.email,verifiedUser.firstName);
     await generateTokensAndSetCookies(
      verifiedUser,
      res
    ); 
     return res.status(200).json({success:true,
      message:"Email Verifed Successfully",
      user: {
        firstName: verifiedUser.firstName,
        email: verifiedUser.email,
        role: verifiedUser.role,
        authProvider: "jwt",
        _id: user._id,
        image: verifiedUser.photo,
      }
    })   
    } catch (error) {
      console.error('verificationCode', error);
      
        return res.status(500).json({ success:false, error });
    }
};



const forgotPassword = async (req, res) => {
const {email} = req.body;
try {
  const user = await Users.findOne({ email });
  if(!user) {
  return res.status(404).json({ success: false, message: 'user not found'});
  };
  if(!user.isVerified){
    return res
      .status(403)
      .json({ success: false, message: "email not verified" });
  };
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();// random 6 digit
  user.verificationCode = verificationCode
  await user.save();
  await sendVerificationEmail(user.email, verificationCode);
  return res.status(201).json({
    success: true,
    message: "verification code has been sent to your email.",
  });
} catch (error) {
  return res.status(500).json({ success:false, error });
}
};


const resetPassword = async (req, res) => {
const {verificationCode, email, password} = req.body.formData;


if(!verificationCode || !email || !password) {
 return res.status(403).json({ success: false, message: 'all fields required' })};
try {
  const user = await Users.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: 'user not found'});
  };
  // Check if the account is currently locked
  if (user.lockresetPasswordUntil && user.lockresetPasswordUntil > Date.now()) {
    return res
      .status(403)
      .json({ success: false, message: "Account is locked. Please try again later." });
  };
  if(verificationCode !== user.verificationCode) {
    // Increment attempts
    user.resetPasswordAttempts += 1;
    // Lock the account if attempts exceed the maximum limit
    if(user.resetPasswordAttempts >= 3) {
      user.lockresetPasswordUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Lock for 1 day
      user.resetPasswordAttempts = 0; // Reset login attempts after locking
    }
    await user.save();
    return res.status(404).json({ success: false, message: 'invalid verification code'});
  };
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Update the user's password
  user.password = hashedPassword;
  await user.save();
  return res.status(200).json({ success: true, message: "Password reset successfully" });

} catch (error) {
  return res.status(500).json({ success:false, error });
}
};

const getAllUsers = async (req, res) => {
  try {
    const data = await Users.find();
    return res.status(200).json({ success: true, message: 'Users fetched successfully', data})
  } catch (error) {
     return res.status(500).json({ success: false, error }); 
  }
};

const deleteUser = async (req, res) => {
  const {_id} = req.body;
  if(!_id) {
   return res.status(400).json({ success: false, message: "id required"})
  };
  try {
    await Users.findByIdAndDelete(_id);
    return res.status(200).json({ success: true, message: "user successfully deleted"})
  } catch (error) {
    return res.status(500).json({ success: false, error})
  }
};

const adminProfileEdit = async (req, res) => {
  
  const {adminId: _id, email, password, image: photo} = req.body;
  
  if (!_id) {
    return res.status(400).json({ success: false, message: "Unauthorized Request" });
  }

  try {
    /** 
     * Hash the password before updating if it is provided
     */
    let updateData = { email, photo };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updateData.password = hashedPassword;
    }

    const data = await Users.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    } else {
      const { password, refreshToken, lastName, googleId,  isVerified, loginAttempts,
        resetPasswordAttempts, verificationCodeAttempts, verificationResendAttempts, ...sanitizedData } = data.toObject();
      return res.status(200).json({ success: true, message: "Profile updated successfully", data: sanitizedData });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating profile", error });
  }
};

const userProfileEdit = async (req, res) => {
  
  const {userId: _id, password, image: photo} = req.body;
  
  if (!_id) {
    return res.status(400).json({ success: false, message: "Unauthorized Request" });
  }

  try {
    /** 
     * Hash the password before updating if it is provided
     */
    let updateData = { photo };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      updateData.password = hashedPassword;
    }

    const data = await Users.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    } else {
      const { password, refreshToken, lastName, googleId,  isVerified, loginAttempts,
        resetPasswordAttempts, verificationCodeAttempts, verificationResendAttempts, ...sanitizedData } = data.toObject();
      return res.status(200).json({ success: true, message: "Profile updated successfully", data: sanitizedData });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating profile", error });
  }
};


export { register, login,
refreshRequest, logout,
verificationCode, resendVerificationCode,
forgotPassword,
resetPassword,
getAllUsers,
deleteUser,
adminProfileEdit,
userProfileEdit };
