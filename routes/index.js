const express=require('express');
const productModel=require('../models/product-model');
const router=express.Router();
const isLoggedin=require('../middlewares/isLoggedin');
const userModel=require('../models/user-model');

router.get("/",function(req,res){
    let error=req.flash("error");
    let success=req.flash("success");
    res.render("index",{error,success,loggedin:false});
})

router.get("/shop",isLoggedin,async function(req,res){
    let products=await productModel.find();
    let success=req.flash("success");
    res.render("shop",{products,success});
});

router.get("/addtocart/:id",isLoggedin,async (req,res)=>{
    let product=await productModel.find({_id:req.params.id});
    let user=await userModel.findOne({email:req.user.email});
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success","Added to Cart");
    res.redirect("/shop");
});

router.get("/cart",isLoggedin,async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email}).populate("cart");
    const bill=Number(user.cart[0].price+20)-Number(user.cart[0].discount);
    res.render("cart",{user,bill});
});



module.exports=router;