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
  imgUrl:String,
  unit: String,

});

ProductSchema.methods.quantityChanger = function(cb) {
  this.save(cb);
};


mongoose.model('Product', ProductSchema);
