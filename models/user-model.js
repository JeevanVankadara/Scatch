const mongoose=require('mongoose');

const Userschema=mongoose.Schema({
    fullname: String,
    email : String,
    password: String,
    cart:{
        type: Array,
        default:[]
    },
    iadmin: Boolean,
    orders : {
        type: Array,
        default:[]
    },
    contact : Number,
    picture : String
});

module.exports=mongoose.model("user",Userschema);