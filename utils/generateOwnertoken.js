const jwt=require('jsonwebtoken');

function generateOwnertoken(owner){
    return jwt.sign({email:owner.email,id:owner.id},process.env.JWT_KEY_OWNER);
}

module.exports.generateOwnertoken=generateOwnertoken;