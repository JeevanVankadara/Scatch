const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const userModel=require('../models/user-model');
const jwt=require('jsonwebtoken');
const {generateToken}=require('../utils/generatetoken');

const {registerUser}=require('../controllers/authController');
const {loginUser}=require('../controllers/authController');
const isLoggedin = require('../middlewares/isLoggedin');

router.get("/",(req,res)=>{
    res.send("Hey");
});

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/");
});

router.get("/DeleteAccount",isLoggedin,async (req,res)=>{
    let user=await userModel.findOneAndDelete({email:req.user.email});
    res.cookie("token","");
    res.redirect("/");
});

module.exports=router;