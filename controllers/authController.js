const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const userModel=require('../models/user-model');
const jwt=require('jsonwebtoken');
const {generateToken}=require('../utils/generatetoken');

module.exports.registerUser=async function(req,res){
        try{
            let {fullname,email,password}=req.body;

            let user=await userModel.findOne({email});
            if(user){
                return res.status(401).send("Email already Used");
            }
            else{
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(password,salt,async (err,hash)=>{
                    if(err) return res.send(err.message);
                    else{
                        let createdUser= await userModel.create({
                            fullname,
                            email,
                            password:hash
                        })
                        let token=generateToken(createdUser);
                        res.cookie("token",token);
                        req.flash("success","User created successfully");
                        res.redirect("/");
                    }
                })
            })
        }
        }
        catch(err){
            res.send(err.message);
        }
};

module.exports.loginUser= async function(req,res){
        try{
            let {email,password}=req.body;
            let user=await userModel.findOne({email});

            if(!user) {
                req.flash("error","User not found");
                return res.redirect("/");
            }
            bcrypt.compare(password,user.password,function(err,result){
                if(result){
                    let token=generateToken(user);
                    res.cookie("token",token);
                    req.flash("success","Logged in successfully");
                    return res.redirect("/shop");
                }
                else{
                    req.flash("error","password is incorrect");
                    res.redirect("/");
                }
            })
        }
        catch(err){
            res.send(err.message);
        }
};