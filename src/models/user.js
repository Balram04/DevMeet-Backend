const mongoose =require('mongoose');

const userSchema = new mongoose.Schema ({
    firstname:{
        type:String,        
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
     skills:{
        type:[String],
     },
    photoUrl: {
      type: String,
      default: "", // can be filled by OAuth image
    },
     
},
{
   timestamps:true,
}
);

module.exports = mongoose.model('User',userSchema);
// const mongoose = require('mongoose');    


 