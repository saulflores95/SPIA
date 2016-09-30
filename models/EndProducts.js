var mongoose = require('mongoose');

var EndProductSchema = new mongoose.Schema({
  client: String,
  partNumber: {type: Number, default: 0},
  quantity: {type: Number, default: 0},
  price: {type: Number, default: 0},
  unit: String,
  imgUrl: String,
});


mongoose.model('EndProduct', EndProductSchema);
