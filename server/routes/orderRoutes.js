const express = require("express");
const router = express.Router();

let orders = require("../data/orders");

// Create Order
router.post("/", (req, res) => {
    const { items, customer } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    if (!customer || !customer.name || !customer.address || !customer.phone) {
        return res.status(400).json({ message: "Invalid customer details" });
    }

    const newOrder = {
        id: Date.now(),
        items,
        customer,
        status: "Order Received"
    };

    orders.push(newOrder);

    res.status(201).json(newOrder);
});

module.exports = router;