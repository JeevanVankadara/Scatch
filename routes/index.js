const express=require('express');
const productModel=require('../models/product-model');
const router=express.Router();
const isLoggedin=require('../middlewares/isLoggedin');
const userModel=require('../models/user-model');
const bcrypt=require('bcrypt');
const filters=require('./filters');
const orderModel=require('../models/orders-model');

router.get("/",function(req,res){
    let error=req.flash("error");
    let success=req.flash("success");
    res.render("index",{error,success,loggedin:false});
})

router.get("/shop",isLoggedin,async function(req,res){
    let products=await productModel.find();
    let success=req.flash("success");
    let error=req.flash("error");
    let user= await userModel.findOne({email:req.user.email});
    res.render("shop",{products,success,user,filter:"",error});
});

router.use("/filter",filters);

router.get("/addtocart/:id",isLoggedin,async (req,res)=>{
    let product=await productModel.find({_id:req.params.id});
    let user=await userModel.findOne({email:req.user.email});
    if(user.cart.includes(req.params.id)){
        req.flash("error","item already present in cart");
        return res.redirect("/shop");
    }
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success","Added to Cart");
    res.redirect("/shop");
});

router.get("/cart",isLoggedin,async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email}).populate("cart");
    res.render("cart",{user});
});

router.get("/account",isLoggedin,async (req,res)=>{
    let user= await userModel.findOne({email:req.user.email});
    let success= req.flash("success");
    let error=req.flash("error");
    res.render("myaccount",{user,success,error});
});

router.post("/changedetails",isLoggedin,async (req,res)=>{
    let user= await userModel.findOne({email:req.user.email});
    let{fullname,oldpass,newpass,contact,address,pincode}=req.body;
        bcrypt.compare(oldpass, user.password, async function(err, result){
            if(result){
                    if(newpass===''){
                        user.fullname=fullname;
                        user.contact=contact;
                        user.address=address;
                        user.pincode=pincode;
                        await user.save();
                        req.flash("success","updated successfully");
                        res.redirect("/account");
                    }
                    else{
                        user.fullname = fullname;
                        user.contact = contact;
                        user.address=address;
                        user.pincode=pincode;                        
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newpass, salt, async (err, hash) => {
                                if(err) return res.send(err.message);
                                else {
                                    user.password = hash;
                                    await user.save();
                                    req.flash("success","updated successfully");
                                    res.redirect("/account");
                                }
                });
                        
            });
        }
        }
            else {
            req.flash("error","Old password mismatched");
            res.redirect("/account");
        }
    });
});

router.get("/removeproduct/:product_id",isLoggedin,async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email});
    if(!user) return res.redirect("/");
    const i=user.cart.indexOf(req.params.product_id);
    if(i !==-1){
        user.cart.splice(i,1);
    }
    await user.save();
    res.redirect("/cart");
});

router.get("/myorders", isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let orders = await orderModel.find({ user: user._id }).populate("products");
    res.render("myorders", { user, orders });
});


router.post("/checkout",isLoggedin,async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email});
    if(!user) return res.redirect("/");
    let{products,totalCost}=req.body;

    let order=await orderModel.create({
        products:products.map(p=>p.id),
        user:user._id,
        totalCost:totalCost,
    })

    user.orders.push(order._id);

    await user.save();
    res.redirect("/myorders");
});

module.exports=router;