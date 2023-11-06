const mongoose = require("mongoose");

const userSchema= new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
        
    },
    token:{
        type:String,
        required:true,
    },
    firstName:
    {
        type:String
    },
    lastName:
    {
        type:String
    },
    phoneNumber:
    {
        type:Number
    },
    email:
    {
        type:String
    },
    country:
    {
        type:String
    }, address:{
        type:String
    }, city:{
        type:String
    }, state:{
        type:String
    }, zipcode:{
        type:String
    }
})

const Users=mongoose.model("Users",userSchema);
module.exports={
    Users,
}