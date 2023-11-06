const mongoose = require("mongoose");

const gameSchema=new mongoose.Schema({
     game_id:{
        type:String,
        required:true
     }, game_name:{
        type:String,
        required:true
     }, datetime_start:{
      ref:"Users",
        type:String,
        
     }, datetime_end:{
      ref:"Users",
        type:String,
       
     }, prize_name:{
        type:String,
        
     }, prize_image:{
        type:String,
        
     }, prize_url:{
        type:String,
        
     }
})

const Games=mongoose.model("Games",gameSchema);
module.exports={
    Games
}