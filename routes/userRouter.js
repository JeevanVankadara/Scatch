const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const userModel=require('../models/user-model');
const jwt=require('jsonwebtoken');
const {generateToken}=require('../utils/generatetoken');

const {registerUser}=require('../controllers/authController');
const {loginUser}=require('../controllers/authController');

router.get("/",(req,res)=>{
    res.send("Hey");
});

router.post("/register",registerUser);

router.post("/login",loginUser);

module.exports=router;