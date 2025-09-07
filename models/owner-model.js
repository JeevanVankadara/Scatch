const { ref } = require('joi');
const mongoose=require('mongoose');

const ownerschema=mongoose.Schema({
    fullname: {
        type:String,
        minLength:3,
        trim:true,
    },
    email : String,
    password: String,
    iadmin: Boolean,
    products : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
    }],
    contact : Number,
    picture : String,
    gstin:String
});

module.exports=mongoose.model("owner",ownerschema);