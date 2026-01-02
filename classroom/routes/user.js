const express = require("express");
const router = express.Router();

// USER====================
//index rout
router.get("/", (req, res) => {
  res.send("GET for users");
});

//Show routerrout
router.get("/:id", (req, res) => {
  res.send("GET for show users id");
});

//Post rout
router.post("/", (req, res) => {
  res.send("POST for users");
});

//Delete rout
router.delete("/:id", (req, res) => {
  res.send("DELETE for users id ");
});

module.exports = router;
