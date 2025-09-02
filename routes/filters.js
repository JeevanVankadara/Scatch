const express=require('express');
const isLoggedin = require('../middlewares/isLoggedin');
const userModel=require('../models/user-model');
const router=express.Router();
const productModel=require('../models/product-model');
const { ObjectId } = require("mongodb");


router.get("/new",isLoggedin,async (req,res)=>{
    const date=new Date("2024-08-20");
    const objectid=ObjectId.createFromTime(date.getTime()/1000);

    let products=await productModel.find({_id:{$gt:objectid}}).sort({_id:-1});
    let user=await userModel.findOne({email:req.user.email});
    res.render("shop",{products,success:req.flash("New"),user,filter:"New"});
}); 

router.get("/Discount",isLoggedin,async (req,res)=>{
    let products=await productModel.find({discount:{$gt:0}}).sort({discount:-1});
    let user=await userModel.findOne({email:req.user.email});
    res.render("shop",{products,success:req.flash("New"),user,filter:"Discount"});
})

module.exports=router;