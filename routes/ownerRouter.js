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

router.get("/logout",isOwnerLoggedin,(req,res)=>{
    res.cookie("Ownertoken","");
    res.redirect("/owners/create");
});

router.get("/myaccount",isOwnerLoggedin,async (req,res)=>{
    let owner=await ownerModel.findOne({email:req.owner.email});
    let success=req.flash("success");
    let error=req.flash("error");
    res.render("ownerpages/myaccount",{owner,success,error});
});

router.get("/addproduct",isOwnerLoggedin,function(req,res){
    let success=req.flash("success");
    let error=req.flash("error")
    res.render("createproducts",{success,error});
});

router.post("/changedetails",isOwnerLoggedin,async (req,res)=>{
    let owner=await ownerModel.findOne({email:req.owner.email});
    let{fullname,email,oldpass,newpass,confnewpass,contact,gstin}=req.body;
    if(!owner){
        req.flash("error","Login first");
        return res.redirect("/owner/create");
    }

    bcrypt.compare(oldpass,owner.password,async (err,result)=>{
        if(result){
            owner.fullname=fullname;
            owner.email=email;
            owner.contact=contact;
            owner.gstin=gstin;
            if(newpass && confnewpass){
                if(newpass===confnewpass){
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(newpass,salt,async (err,hash)=>{
                            if(err){
                                req.flash("error","something went wrong");
                                return res.redirect("/owners/myaccount")
                            }
                            owner.password=hash;
                            await owner.save();
                        })
                    })
                }
            }
            await owner.save();
            req.flash("success","updated successfully");
            res.redirect("/owners/myaccount");
        }
        else{
            req.flash("error","Old password mismatched");
            res.redirect("/owners/myaccount");
        }
    })

})

module.exports=router;