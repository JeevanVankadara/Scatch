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
    products : {
        type: Array,
        default:[]
    },
    contact : Number,
    picture : String,
    gstin:String
});

module.exports=mongoose.model("owner",ownerschema);