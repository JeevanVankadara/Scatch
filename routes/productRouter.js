const express=require('express');
const router=express.Router();
const productModel=require('../models/product-model');
const upload=require('../config/multer-config');

router.post("/create",upload.single("image"),async (req,res)=>{
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
    req.flash("success","Product created successfully");
    res.redirect("/owners/admin");
    }
    catch(err){
        res.send(err.message);
    }
})

module.exports=router;