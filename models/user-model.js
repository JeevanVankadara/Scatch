const mongoose=require('mongoose');

const Userschema=mongoose.Schema({
    fullname: String,
    email : String,
    password: String,
    cart:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"product",
    }],
    orders : {
        type: Array,
        default:[]
    },
    contact : Number,
    picture : String,
    address : String,
    pincode : Number,
});

module.exports=mongoose.model("user",Userschema);