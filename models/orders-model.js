const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product",
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    totalCost:Number,
    ordered:{
        type:Boolean,
        default:true,
    },
    shipped:{
        type:Boolean,
        default:false,
    },
    outforDelivery:{
        type:Boolean,
        default:false,
    },
    delivered:{
        type:Boolean,
        default:false,
    }
});

module.exports=mongoose.model("order",orderSchema);