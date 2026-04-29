const express = require("express");
const router = express.Router();
const menu = require("../data/menu");

router.get("/", (req, res) => {
    res.json(menu);
});

module.exports = router;