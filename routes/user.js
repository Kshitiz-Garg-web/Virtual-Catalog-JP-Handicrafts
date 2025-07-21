const express = require('express')
const passport = require('passport');

const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsyc');
const { getSignupPage, signup_addCredentials, loginPage, login_checkCredentials, logout } = require('../controllers/users')

const router = express.Router();

router.route('/signup')
  // signup-page, Get
  .get(getSignupPage)
  // signup, add-credentials, Post
  .post(wrapAsync(signup_addCredentials));

router.route('/login')
  // loginPage, Get
  .get(loginPage)
  // login, check_Credentials, Post
  .post(
    passport.authenticate('local',
      {
        failureFlash: true,
        failureRedirect: "/login"
      }),
    login_checkCredentials);

// logout, delete_Credentials, Delelte
router.get('/logout', logout)

module.exports = router;