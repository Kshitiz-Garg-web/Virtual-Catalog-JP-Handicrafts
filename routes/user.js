const express = require('express')

const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsyc');
const passport = require('passport');


const router = express.Router();


router.get('/signup', (req, res) => {
  res.render("users/signup.ejs")
})

router.post('/signup', wrapAsync(async (req, res) => {
  try {
    console.log(req.body)
    let { username, email, password } = req.body;
    const newUser = new User({ email, username })
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser)
    req.flash('success', "Welcome to Sphere")
    res.redirect('/listings')
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('/signup')
  }
}))

router.get('/login', (req, res) => {
  res.render("users/login.ejs")
})

router.post('/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: "/login"
  }),
  async (req, res) => {
    req.flash('success', "Welcome back to Sphere")
    res.redirect('/listings')
  })


module.exports = router;