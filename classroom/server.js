const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/posts.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
// const { name } = require("ejs");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Storing and using session
const sessionOption = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOption));
app.use(flash()); // messages la flash karnyasathi

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  if (name === "anonymous") {
    req.flash("error", "user not registered");
  } else {
    req.flash("success", "user registered successfully");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  // console.log(req.flash("success"));
  // res.locals.success = req.flash("success");
  // res.locals.error = req.flash("error");
  res.render("page.ejs", { name: req.session.name });
});

// app.use(cookieParser());

// app.get("/setcookies", (req, res) => {
//   res.cookie("greet", "namaste");
//   res.cookie("Origin", "India");
//   res.send("we sent you a cook");
// });

// app.get("/greet", (req, res) => {
//   let { name = "anonymous" } = req.cookies;
//   res.send(`Hi ${name} helloo`);
// });

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("Hi i am root page");
// });

// app.use("/users", users);
// app.use("/posts", posts);
// ================================================

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req, res) => {
//   res.send("hi this is secret");
// });

app.listen(3000, () => {
  console.log("app is listening");
});
