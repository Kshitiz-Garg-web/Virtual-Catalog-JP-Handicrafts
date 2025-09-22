const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    // unique: true,   // 👈 add this
    // trim: true,     // optional: spaces remove karega
    // lowercase: true // optional: email ko lower case store karega
  }
});

// UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);