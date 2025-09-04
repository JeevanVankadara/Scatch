const express=require('express');
const app=express();
const path=require('path');

require('dotenv').config();

const session = require('express-session');
const flash = require('connect-flash');
const expressSession=require('express-session');

const db=require('./config/mongoose-connection');
const ownerRouter=require('./routes/ownerRouter');
const productRouter=require('./routes/productRouter');
const userRouter=require('./routes/userRouter');
const indexRouter=require('./routes/index');
const orderRouter=require('./routes/orders');


const cookieParser=require('cookie-parser');

app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret:process.env.EXPRESS_SESSION_SECRET,
    })
);

// Flash middleware
app.use(flash());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");

app.use("",indexRouter);

app.use("/owners",ownerRouter);
app.use("/users",userRouter);
app.use("/products",productRouter);

app.use("/orders",orderRouter);

app.listen(3000);