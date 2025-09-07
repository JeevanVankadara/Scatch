const express=require('express');
const router=express.Router();
const ownerModel=require('../models/owner-model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const{loginOwner}=require('../controllers/ownerauthController');
const isOwnerLoggedin=require('../middlewares/isOwnerLoggedin');


if(process.env.NODE_ENV==="development"){
    router.post("/createowner",async (req,res)=>{
        let owners=await ownerModel.find();
        let {fullname,email,password,contact,gstin}=req.body;
        if(owners.length===0){
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(password,salt,async (err,hash)=>{
                    let owner=await ownerModel.create({
                        fullname,
                        email,
                        password:hash,
                        contact,
                        gstin
                    });
                    req.flash("success","Owner created successfully");
                    res.redirect("/owners/create");
                })
            })
        }
        else{
            req.flash("error","Only One owner is allowed");
            res.redirect("/owners/create");
        }
    })
}

router.get("/create",(req,res)=>{
    let success=req.flash("success");
    let error=req.flash("error");
    res.render("Ownercreate.ejs",{success,error,loggedin:false});
});

router.get("/index",isOwnerLoggedin,async (req,res)=>{
    let success=req.flash("success");
    let error=req.flash("error");
    let owner=await ownerModel.findOne({email:req.owner.email});
    res.render("ownerIndex",{success,error,owner});
})

router.post("/login",loginOwner);



router.get("/admin", function(req,res){
    let success=req.flash("success");
    res.render("createproducts",{success});
})

module.exports=router;