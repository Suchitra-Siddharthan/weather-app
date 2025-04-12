const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: String,
  country: String,
  description: String
});

module.exports = mongoose.model('Destination', destinationSchema);
