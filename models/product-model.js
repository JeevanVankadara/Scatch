const mongoose=require('mongoose');

const productschema=mongoose.Schema({
    image: Buffer,
    mimetype:String,
    name: String,
    price: Number,
    discount :
    {
        type: Number,
        default: 0
    },
    bgcolor : String,
    panelcolor: String,
    textcolor: String
});

module.exports=mongoose.model("product",productschema);