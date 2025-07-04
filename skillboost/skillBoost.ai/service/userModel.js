const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Login', loginSchema); // ✅ NOT 'LoginSchema'