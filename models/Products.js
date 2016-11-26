var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  title: String,
  quantity: {type: Number, default: 0},
  //comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  weight: {type: Number, default:0},
  height: {type: Number, default:0},
  width:  {type: Number, default:0},
  description: String,
  tags: String,
  suppplier: String,
  fileName:String,
  unit: String,
  dateCreated: String,
  url: String,

});

ProductSchema.methods.subtract = function(newProduct, cb) {
  this.quantity -= newProduct.diffQuantity;
  this.save(cb);
};

ProductSchema.methods.add = function(newProduct, cb) {
  this.quantity += newProduct.diffQuantity;
  this.save(cb);
};


ProductSchema.methods.edit = function (newProduct ,cb) {
  this.title = newProduct.title;
  this.quantity = newProduct.quantity;
  this.description = newProduct.description;
  this.tags = newProduct.tags;
  this.suppplier = newProduct.suppplier;
  this.unit = newProduct.unit;
  this.weight = newProduct.weight;
  this.width = newProduct.width;
  this.height = newProduct.height;
  this.save(cb);
};


mongoose.model('Product', ProductSchema);
