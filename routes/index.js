const express=require('express');
const productModel=require('../models/product-model');
const router=express.Router();
const isLoggedin=require('../middlewares/isLoggedin');

router.get("/",function(req,res){
    let error=req.flash("error");
    let success=req.flash("success");
    res.render("index",{error,success});
})

router.get("/shop",isLoggedin,async function(req,res){
    let products=await productModel.find();
    res.render("shop",{products});
});

module.exports=router;