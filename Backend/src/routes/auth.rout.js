const {Router}=require("express")
const {registerUserController,loginUserController,logoutUserController
    ,getmeUserController,forgotPasswordController,resetPasswordController,validateResetTokenController
}=require("../controllers/auth.controller")
const {authUser}=require("../middlewares/auth.middleware")

const authRouter=Router();

/**
 @post
 /api/auth/register
 @description user can register through email ,username and password
 */
authRouter.post("/register",registerUserController)

/**
 @post
 /api/auth/login
 @description user can login through email and password
 */
authRouter.post("/login",loginUserController)

/**
 @get
 /api/auth/logout
 @description use will logout clear the cookie and add it to blacklist
 */
authRouter.get("/logout",logoutUserController)



/**
 @get
 /api/auth/get-me
 @description give the logged in user detail
 */
authRouter.get("/get-me",authUser,getmeUserController)

/**
 @post
 /api/auth/forgot-password
 @description generate a secure reset token and send email
 */
authRouter.post("/forgot-password", forgotPasswordController)

/**
 @post
 /api/auth/reset-password
 @description set a new password using reset token
 */
authRouter.post("/reset-password", resetPasswordController)

/**
 @post
 /api/auth/validate-reset-token
 @description validate if reset token is valid and not expired
 */
authRouter.post("/validate-reset-token", validateResetTokenController)

module.exports=authRouter