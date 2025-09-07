const express=require('express');
const router=express.Router();
const productModel=require('../models/product-model');
const upload=require('../config/multer-config');
const isOwnerLoggedin=require('../middlewares/isOwnerLoggedin');
const ownerModel=require('../models/owner-model');

router.post("/create",upload.single("image"),isOwnerLoggedin,async (req,res)=>{
    try{
        let {image,name,price,discount ,bgcolor ,panelcolor,textcolor}=req.body;
        let mimetype=req.file.mimetype;
        let product=await productModel.create({
        image:req.file.buffer,
        mimetype:mimetype,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
    });

    let owner=await ownerModel.findOne({email:req.owner.email});
    owner.products.push(product._id);
    await owner.save();
    req.flash("success","Product created successfully");
    res.redirect("/owners/addproduct");
    }
    catch(err){
        res.send(err.message);
    }
});

module.exports=router;