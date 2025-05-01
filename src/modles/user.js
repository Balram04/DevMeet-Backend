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
     },
    password:{
        type:String,
     },
    confirmpassword:{
        type:String,
     },
    date:{
        type:Date,
        default:Date.now
     },
});

module.exports = mongoose.model('User',userSchema);
// const mongoose = require('mongoose');    