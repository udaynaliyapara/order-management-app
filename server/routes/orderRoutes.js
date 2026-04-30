const express = require("express");
const router = express.Router();

let orders = require("../data/orders");

// Create Order
router.post("/", (req, res) => {
    const { items, customer } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Cart cannot be empty" });
    }
    if (!customer || !customer.name || !customer.address || !customer.phone) {
        return res.status(400).json({ message: "Complete customer details are required" });
    }

    const newOrder = {
        id: Date.now().toString(),
        items,
        customer,
        status: "Order Received"
    };

    orders.push(newOrder);

    const emitUpdate = (status) => {
        newOrder.status = status;
        if (req.io) {
            req.io.emit("status_update", newOrder);
        }
    };

    setTimeout(() => {
        emitUpdate("Preparing");
    }, 5000);

    setTimeout(() => {
        emitUpdate("Out for Delivery");
    }, 10000);

    setTimeout(() => {
        emitUpdate("Delivered");
    }, 15000);

    res.status(201).json(newOrder);
});


// Get Order by ID
router.get("/:id", (req, res) => {
    const order = orders.find(o => o.id == req.params.id);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
});


module.exports = router;