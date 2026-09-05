const mongoose=require("mongoose")

const blackListSchema= new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to be added in blaclist"]
    }
},{timestamps:true})

const blackListModel=mongoose.model("blaclist",blackListSchema)

module.exports=blackListModel