if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const cookieParser = require('cookie-parser')
const seassion = require("express-session")
const mongoStore = require('connect-mongo')
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
const User = require("./models/user.js");
const MongoStore = require('connect-mongo');
//middleware




const app = express();
const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.MONGO_ENCRYPT_SECRET
  },
  touchAfter: 24 * 60 * 60,
})

store.on('error', (err) => {
  console.log('ERROR in the Mongo Sseassion Store - ', err)
})

const seassionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
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
    console.log("Mongoose Connection Error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
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

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.currUser = req.user;
  next()
})

app.get("/", (req, res) => {
  res.render("home.ejs");
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


app.listen(8000, () => {
  console.log("server is listening to port 8000");
  console.log("http://localhost:8000");
});

