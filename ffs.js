const express=require('express');
const bcrypt=require('bcrypt');

bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash("aruna@123",salt,(err,hash)=>{
        console.log(hash);
    })
});