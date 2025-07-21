if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const cookieParser = require('cookie-parser')
const seassion = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")

const path = require("path");

const ExpressError = require('./utils/ExpressError.js')
//Router
const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')
//Model
const User = require("./models/user.js")
//middleware




const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/VirtualCatalog";
const seassionOptions = {
  secret: "mysuperpassofsec",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    maxAge: 20 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}


main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
// app.use(cookieParser("secretcode"))
app.use(seassion(seassionOptions));
app.use(flash())

// configure basic setting
app.use(passport.initialize())
app.use(passport.session())
// To setup Passport-Local Mongoose use this code
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/", (req, res) => {
  res.send("yes i am root");
});

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.currUser = req.user;
  console.log("success key -> ", res.locals.success)
  console.log("error key -> ", res.locals.error)
  next()
})

app.use("/listings", listingRouter)
app.use('/listings/:id/reviews', reviewRouter)
app.use('/', userRouter)

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render('error.ejs', { statusCode, message });
});


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

