const User = require('../models/user');

// signup-page, Get
module.exports.getSignupPage = (req, res) => {
  res.render("users/signup.ejs")
}

// signup, add-credentials, Post
module.exports.signup_addCredentials = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username })
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err)
      }
      req.flash('success', "Namaste! Explore the beauty of JP Handicrafts.")
      return res.redirect('/listings')
    })
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('/signup')
  }
}

// loginPage, Get
module.exports.loginPage = (req, res) => {
  res.render("users/login.ejs")
}

// login, check_Credentials, Post
module.exports.login_checkCredentials = async (req, res) => {
  req.flash('success', "Namaste! Explore the beauty of JP Handicrafts.")
  res.redirect('/listings')
}

// logout, delete_Credentials, Delelte
module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err)
    }
    req.flash('success', "You’ve logged out. Come back soon to JP Handicrafts!")
    return res.redirect('/listings')
  })
}