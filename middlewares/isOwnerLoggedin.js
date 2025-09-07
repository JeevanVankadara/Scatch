const jwt=require('jsonwebtoken');
const ownerModel=require('../models/owner-model');

module.exports=async function(req,res,next){
    if(!req.cookies.Ownertoken){
        req.flash("error","Login first");
        return res.redirect("/owners/create");
    }
    try{
        let decoded=jwt.verify(req.cookies.Ownertoken,process.env.JWT_KEY_OWNER);
        let owner=await ownerModel.findOne({email:decoded.email}).select("-password");
        req.owner=owner;
        next();
    }
    catch(err){
        req.flash("error","something went wrong");
        res.redirect("/owners/create");
    }
}