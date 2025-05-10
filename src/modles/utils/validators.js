const validator =require('validator');
const ex= require('express');

const signupvalidation=(req)=>{
     const{ firstname,lastname,password,email }=req.body;

     if(!validator.isEmail(email)){

        throw new Error("sahi gmail likh bhai")
        
     }else if(!firstname || !lastname){
        throw new Error ("naam likh pahle")
     } else if(!validator.isStrongPassword(password)){
        throw new Error("bhai thoda dang ka pswrd likhde ")
     }

};
module.exports=  signupvalidation ;