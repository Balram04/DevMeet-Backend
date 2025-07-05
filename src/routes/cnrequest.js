const express = require("express");
const { authMiddleware } = require('../middlewares/auth');

const reqRouter =express.Router();

reqRouter.post("/sentconnectionrequest", authMiddleware, async (req, res) => {
     const user =req.user;
     if(!user){
        return res.status(401).send({message:"User not found"});
     }
     res.send( " connection request sent by "+ user.firstname);
});

module.exports=reqRouter;