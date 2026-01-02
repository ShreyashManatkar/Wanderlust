const express = require("express");
const router = express.Router();
// POST============================
//index rout
router.get("/", (req, res) => {
  res.send("GET for posts");
});

//Show rout
router.get("/:id", (req, res) => {
  res.send("GET for show posts id");
});

//Post rout
router.post("/", (req, res) => {
  res.send("POST for posts");
});

//Delete rout
router.delete("/:id", (req, res) => {
  res.send("DELETE for posts id ");
});

module.exports=router;