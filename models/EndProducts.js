var mongoose = require('mongoose');

var EndProductSchema = new mongoose.Schema({
  client: String,
  partNumber: String,
  description: String,
  orderNumber: String,
  quantity: {type: Number, default: 0},
  price: {type: Number, default: 0},
  unit: String,
  imgUrl: String,
  fileName:String,
  dateCreated: String,
  url: String,

});

EndProductSchema.methods.subtract = function(newProduct, cb) {
  this.quantity -= newProduct.diffQuantity;
  this.save(cb);
};

EndProductSchema.methods.add = function(newProduct, cb) {
  this.quantity += newProduct.diffQuantity;
  this.save(cb);
};



mongoose.model('EndProduct', EndProductSchema);
