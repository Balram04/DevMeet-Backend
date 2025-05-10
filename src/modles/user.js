const mongoose =require('mongoose');

const userSchema = new mongoose.Schema ({
    firstname:{
        type:String,
        required:true,
        
     },
     adress:{
        type:String,

     },
    lastname:{
        type:String,
     },
    email:{
        type:String,
        required:true,
        unique:true,
      
     },
    password:{
        type:String,
        unique:true,
        minlength:8,
     },
    confirmpassword:{
        type:String,
     },
    date:{
        type:Date,
        default:Date.now
     },
     
},
{
   timestamps:true,
}
);

module.exports = mongoose.model('User',userSchema);
// const mongoose = require('mongoose');    