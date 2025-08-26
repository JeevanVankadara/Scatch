const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/scatch")

.then(function(){
    console.log("connected to mongoDB");
})
.catch(function(err){
    console.log(err);
})

module.exports=mongoose.connection;