const crypto = require("crypto");
const userModel = require("../models/user.model");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const blackListModel=require("../models/blaclist.models")
const { sendPasswordResetEmail } = require("../services/email.service")


async function registerUserController(req, res) {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({
            message: "Email, username and password are required"
        });
    }

  /**check whether user already exist */
  const isUserAlreadyExist= await userModel.findOne({
       $or:[{username},{email}]
  })

  if (isUserAlreadyExist) {
    return res.status(400).json({
        message: "Account already exists with the username or email"
    });
}

  // hashing the password
    const hash= await bcrypt.hash(password,10);
  const newUser=await userModel.create({
      email: String(email).trim().toLowerCase(),
      password:hash,
      username
  })
   const token=jwt.sign({id:newUser._id,username:newUser.username},
    process.env.JWT_SECRET,{expiresIn:"1d"}
   )
   res.cookie("token",token);
   res.status(201).json({
     message:"user register sucessfully",
       user:{
          id:newUser._id,
          username:newUser.username,
          email:newUser.email
       }
   })
}

/**
 login of the user
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: String(email).trim().toLowerCase() });

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    // rest of your code...
    const token = jwt.sign(
    {
        id: user._id,
        username: user.username
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

// console.log("JWT generated:", !!token);

res.cookie("token", token);

// console.log("Cookie set");

return res.status(200).json({
    message: "User logged in successfully",
    user: {
        id: user._id,
        username: user.username,
        email: user.email
    }
});
}




/**
 logout of the user
 */
async function logoutUserController(req, res) {

    const token = req.cookies.token;

    if (token) {
        await blackListModel.create({
            token
        });
    }

    res.clearCookie("token");

    return res.status(200).json({
        message: "User logout successfully"
    });
}




/**
 getme
 @description to get the profile of user
 */
async function getmeUserController(req, res) {
   const user=await userModel.findById(req.user.id)
   res.status(200).json({
    message:"user detail fetch sucessfully",
      user:{
        id:user._id,
        username:user.username,
        email:user.email
      }
   })

   
}






async function forgotPasswordController(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    const user = await userModel.findOne({ email: String(email).trim().toLowerCase() });
    const genericMessage =
        "If an account exists for that email, a password reset link has been sent.";

    if (!user) {
        // Don't reveal whether email exists for security
        return res.status(200).json({ message: genericMessage });
    }

    try {
        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash the token before storing (don't store plaintext)
        const hashedToken = await bcrypt.hash(resetToken, 10);
        
        // Set expiration to 30 minutes
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
        await user.save();

        // Send password reset email
        await sendPasswordResetEmail(user.email, resetToken, user.username);

        return res.status(200).json({ 
            message: genericMessage
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        
        // Don't reveal specific errors to user for security
        return res.status(200).json({ 
            message: genericMessage
        });
    }
}

async function resetPasswordController(req, res) {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({
            message: "Reset token and new password are required"
        });
    }

    if (String(password).length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters"
        });
    }

    try {
        // Find user with valid reset token
        const users = await userModel.find({
            resetPasswordToken: { $ne: null },
            resetPasswordExpires: { $gt: new Date() }
        });

        let user = null;

        // Check each user's hashed token against the provided token
        for (const u of users) {
            const isValid = await bcrypt.compare(token, u.resetPasswordToken);
            if (isValid) {
                user = u;
                break;
            }
        }

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset link"
            });
        }

        // Check if token has expired
        if (user.resetPasswordExpires.getTime() < Date.now()) {
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            return res.status(400).json({
                message: "Reset link has expired. Request a new one."
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Update user password and clear reset token
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.status(200).json({
            message: "Password updated successfully. You can now sign in with your new password."
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            message: "Failed to reset password. Please try again."
        });
    }
}

async function validateResetTokenController(req, res) {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            message: "Reset token is required"
        });
    }

    try {
        // Find user with valid reset token
        const users = await userModel.find({
            resetPasswordToken: { $ne: null },
            resetPasswordExpires: { $gt: new Date() }
        });

        let user = null;

        // Check each user's hashed token against the provided token
        for (const u of users) {
            const isValid = await bcrypt.compare(token, u.resetPasswordToken);
            if (isValid) {
                user = u;
                break;
            }
        }

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset link"
            });
        }

        // Check if token has expired
        if (user.resetPasswordExpires.getTime() < Date.now()) {
            return res.status(400).json({
                message: "Reset link has expired"
            });
        }

        return res.status(200).json({
            message: "Reset token is valid",
            email: user.email
        });
    } catch (error) {
        console.error('Validate token error:', error);
        return res.status(500).json({
            message: "Failed to validate reset token"
        });
    }
}

module.exports = {
    registerUserController,loginUserController,
    logoutUserController,getmeUserController,
    forgotPasswordController,resetPasswordController,validateResetTokenController
};