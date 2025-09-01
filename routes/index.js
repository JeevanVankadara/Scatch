const express=require('express');
const productModel=require('../models/product-model');
const router=express.Router();
const isLoggedin=require('../middlewares/isLoggedin');
const userModel=require('../models/user-model');
const bcrypt=require('bcrypt');

router.get("/",function(req,res){
    let error=req.flash("error");
    let success=req.flash("success");
    res.render("index",{error,success,loggedin:false});
})

router.get("/shop",isLoggedin,async function(req,res){
    let products=await productModel.find();
    let success=req.flash("success");
    let user= await userModel.findOne({email:req.user.email});
    res.render("shop",{products,success,user});
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

router.get("/account",isLoggedin,async (req,res)=>{
    let user= await userModel.findOne({email:req.user.email});
    let success= req.flash("success");
    let error=req.flash("error");
    res.render("myaccount",{user,success,error});
});

router.post("/changedetails",isLoggedin,async (req,res)=>{
    let user= await userModel.findOne({email:req.user.email});
    let{fullname,oldpass,newpass,contact}=req.body;
bcrypt.compare(oldpass, user.password, async function(err, result){
    if(result){
        user.fullname = fullname;
        user.contact = contact;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newpass, salt, async (err, hash) => {
                if(err) return res.send(err.message);
                else {
                    user.password = hash;
                    await user.save();
                    req.flash("success","updated successfully");
                    res.redirect("/account");
                }
            })
        });
    }
    else {
        req.flash("error","Old password mismatched");
        res.redirect("/account");
    }
});

});





module.exports=router;