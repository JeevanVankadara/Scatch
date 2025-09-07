const express=require('express');
const bcrypt=require('bcrypt');
const {generateOwnertoken}=require('../utils/generateOwnertoken');
const ownerModel=require('../models/owner-model');

module.exports.loginOwner=async function(req,res){
    let {email,password}=req.body;
    let owner=await ownerModel.findOne({email});
    if(!owner){
        req.flash("error","Owner not found");
        return res.redirect("/owners/create");
    }
    bcrypt.compare(password,owner.password,(err,result)=>{
        if(err){
            req.flash("error","something went wrong");
            return res.redirect("owners/index");
        }
        if(result){
            let Ownertoken=generateOwnertoken(owner);
            res.cookie("Ownertoken",Ownertoken);
            req.flash("success","Login successfully");
            res.redirect("/owners/index");
        }
        else{
            req.flash("error","Wrong password");
            res.redirect("/owners/create");
        }
    })
    
}