const jwt=require("jsonwebtoken")
const blackListModel = require("../models/blaclist.models");

async function authUser(req,res,next) {
    const token=req.cookies.token;
    
    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    }
    const isTokenBlackList=await blackListModel.findOne({token})
    if(isTokenBlackList){
        return res.status(400).json({
            message:"invalid token"
        })
    }
    try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
     req.user=decoded
     next();
    }
    catch(err){
        return res.status(401).json({
            message:"invalid token"
        })
    }
}

module.exports={authUser}