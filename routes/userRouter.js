const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const userModel=require('../models/user-model');
const jwt=require('jsonwebtoken');
const {generateToken}=require('../utils/generatetoken');

const {registerUser}=require('../controllers/authController');
const {loginUser}=require('../controllers/authController');
const isLoggedin = require('../middlewares/isLoggedin');
const orderModel=require('../models/orders-model');

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

router.get("/account",isLoggedin,async (req,res)=>{
    let user= await userModel.findOne({email:req.user.email});
    let success= req.flash("success");
    let error=req.flash("error");
    res.render("myaccount",{user,success,error});
});

router.get("/cart",isLoggedin,async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email}).populate("cart");
    res.render("cart",{user});
});

router.get("/myorders", isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let orders = (await orderModel.find({ user: user._id }).populate("products").sort({createdAt:-1})).reverse();
    res.render("myorders", { user, orders });
});

module.exports=router;