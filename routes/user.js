const express = require('express')
const passport = require('passport');

const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsyc');


const router = express.Router();


router.get('/signup', (req, res) => {
  res.render("users/signup.ejs")
})

router.post('/signup', wrapAsync(async (req, res, next) => {
  try {
    console.log(req.body)
    let { username, email, password } = req.body;
    const newUser = new User({ email, username })
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser)

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err)
      }
      req.flash('success', "Welcome to Sphere")
      return res.redirect('/listings')
    })
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

router.get('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err)
    }
    req.flash('success', "you are logged out!")
    return res.redirect('/listings')
  })
})

module.exports = router;