if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const port = 8000;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");

// const review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash"); //flash message sathi
const passport = require("passport"); //Authentication sathi
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//new project
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust1";

main()
  .then(() => {
    console.log("Successfully connected to DB");
  })
  .catch((err) => {
    console.log("Error", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); //ejs-mate sathi
app.use(express.static(path.join(__dirname, "/public"))); //Static file sathi(css,js)

//use session and cookies
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("Hi i am root");
});

app.use(session(sessionOptions));
app.use(flash()); // messages la flash karnyasathi

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success"); //locals he res.render chya aat madhe ekadya variable la use karach asel tyasathi use hoto
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
// ================================= fakeuser sathi
// app.get("/demouser", async (req, res) => {
//   let fakeuser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await User.register(fakeuser, "helloworld");
//   res.send(registeredUser);
// });
// ==============================
// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body); //jo listingSchema define kela ahe Joi(schema.js) chya aat tya srv condition req.body purn krte ky like valide data insert krto ka
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

// const validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body); //jo listingSchema define kela ahe Joi(schema.js) chya aat tya srv condition req.body purn krte ky like valide data insert krto ka
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

//listing chya purn code chya jagi khalchi line use keli
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// //index Route
// app.get(
//   "/listings",
//   wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     // res.render("./listings/index.ejs", { allListings });
//     res.render("listings/index", { allListings }); // ✅ fixed
//   })
// );

// //New Route
// app.get(
//   "/listings/new",
//   wrapAsync(async (req, res) => {
//     // res.render("./listings/new.ejs");
//     res.render("listings/new"); // ✅ fixed
//   })
// );

// //READ: Show Route
// app.get(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     // res.render("./listings/show.ejs", { listing });
//     res.render("listings/show", { listing }); // ✅ fixed
//   })
// );

// // Create Route
// app.post(
//   "/listings",
//   validateListing,
//   wrapAsync(async (req, res, next) => {
//     // let{title,description,image,price,location,country}=req.body;      //=====ya type ne suddha access kru shakto
//     // let listing=req.body.listing; //yach instance next line madhe ahe
//     const newListing = new Listing(req.body.listing);
//     //  if (!newListing.title) {                  // ya prakare ek ek filed madhla error handle hou shakto
//     //   throw new ExpressError(400, "Title is misssing");
//     // }
//     await newListing.save();
//     res.redirect("/listings");
//   })
// );

// //Edit Route
// app.get(
//   "/listings/:id/edit",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     // res.render("./listings/edit.ejs", { listing });
//     res.render("listings/edit", { listing }); // ✅ fixed
//   })
// );

// //Update Route
// app.put(
//   "/listings/:id",
//   validateListing,
//   wrapAsync(async (req, res) => {
//     // if (!req.body.listing) {  //listing=>mhnje data like title,description etc
//     //   throw new ExpressError(400, "Send valid data for listing");
//     // }
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   })
// );

// //Destroy Route(Delete)
// app.delete(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
//   })
// );

// //Reviews
// //Post Reviews Rout
// app.post(
//   "/listings/:id/reviews",
//   validateReview,
//   wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     // console.log("new review send");
//     // res.send("new review saved");
//     res.redirect(`/listings/${listing._id}`);
//   })
// );

// //Delete Reviews Route
// app.delete(
//   "/listings/:id/reviews/:reviewId",
//   wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findById(reviewId);
//     res.redirect(`/listings/${id}`);
//   })
// );

// ================================================
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My Villa",
//     description:
//       "A villa is typically a large, luxurious, and often detached house, known for its spaciousness, privacy, and often upscale amenities",
//     price: 300000,
//     location: "lonavla",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("listing true");
//   res.send("successfull testing");
// });

// ========================
// Khalche donhi pn chaltat(comment kelel)*****
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});
// app.use((req, res, next) => {
//   next(new ExpressError(404, "Page not found!"));
// });

//Custom Error handler(Middleware)
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // console.log(statusCode=404,messsage="something went wrong");
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8000, () => {
  console.log("app is listening");
});

//Map pasun rahil