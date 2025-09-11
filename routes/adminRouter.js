const express=require('express');
const userModel=require('../models/user-model');
const orderModel=require('../models/orders-model');
const productModel=require('../models/product-model');
const ownerModel=require('../models/owner-model');
const router=express.Router();

router.get("/",async (req,res)=>{
    let users=await userModel.find();
    let orders=await orderModel.find().sort({createdAt:-1}).populate("user").populate("products");

    let Notcompleted=await orderModel.find({Delivered:false});
    res.render("adminpages/home",{users,orders,Notcompleted});
});

router.get("/logout", (req,res)=>{
    res.cookie("admintoken","");
    res.redirect("/");
});

router.get("/earnings",async (req,res)=>{
    let orders=await orderModel.find().populate("user");
    let totalEarnings = orders.reduce((sum, o) => sum + (o.totalCost || 0), 0);
    let profits=120*orders.length;
    res.render("adminpages/earnings",{orders,totalEarnings,profits});
});

module.exports=router;