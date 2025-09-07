const express=require('express');
const Router=express.Router();
const orderModel = require("../models/orders-model");


Router.post("/update/:id", async (req, res) => {
    try {
        let { step } = req.query;
        let order = await orderModel.findById(req.params.id);

        if (!order) return res.status(404).send("Order not found");

        if (step === "shipped") order.shipped = true;
        if (step === "outforDelivery") order.outforDelivery = true;
        if (step === "delivered") order.delivered = true;

        await order.save();
        res.redirect("/owners/index");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = Router;


module.exports=Router;