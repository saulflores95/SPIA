var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  nombreCliente: String,
  link: String,
  upvotes: {type: Number, default: 0},
  ventasConfirmation: {type: Boolean, default: false},
  disenoConfirmation: {type: Boolean, default: false},
  almacenConfirmation: {type: Boolean, default: false},
  preConfirmation: {type: Boolean, default: false},
  produccionConfirmation: {type: Boolean, default: false},
  acabadosConfirmation: {type: Boolean, default: false},
  planacionConfirmation: {type: Boolean, default: false},
  calidadConfirmation: {type: Boolean, default: false},
  productoTerConfirmation: {type: Boolean, default: false},
  prensaConfirmation: {type: Boolean, default: false},
  entregasConfirmation: {type: Boolean, default: false},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  progress: {type: Number, default:0}

});

PostSchema.methods.ventasConfirmationCapture = function(cb) {
  this.ventasConfirmation = true;
  this.progress += 10;
  this.save(cb);
};

PostSchema.methods.disenoConfirmationCapture = function(cb) {
  this.disenoConfirmation = true;
  this.progress += 10;
  this.save(cb);
};

PostSchema.methods.preConfirmationCapture = function(cb) {
  this.preConfirmation = true;
  this.progress += 10;
  this.save(cb);
};

PostSchema.methods.planacionConfirmationCapture = function(cb) {
  this.planacionConfirmation = true;
  this.progress += 10;
  this.save(cb);
};

PostSchema.methods.produccionConfirmationCapture = function(cb) {
  this.produccionConfirmation = true;
  this.progress += 10;
  this.save(cb);
};

PostSchema.methods.almacenConfirmationCapture = function(cb) {
  this.almacenConfirmation = true;
  this.progress += 10;
  this.save(cb);
};

PostSchema.methods.prensaConfirmationCapture = function(cb) {
  this.prensaConfirmation = true;
  this.progress += 5;
  this.save(cb);
};

PostSchema.methods.acabadosConfirmationCapture = function(cb) {
  this.acabadosConfirmation = true;
  this.progress += 5;
  this.save(cb);
};

PostSchema.methods.calidadConfirmationCapture = function(cb) {
  this.calidadConfirmation = true;
  this.progress += 10;
  this.save(cb);
};

PostSchema.methods.productoTerConfirmationCapture = function(cb) {
  this.productoTerConfirmation = true;
  this.progress += 10;
  this.save(cb);
};

PostSchema.methods.entregasConfirmationCapture = function(cb) {
  this.entregasConfirmation = true;
  this.progress += 10;
  if(this.progress > 100){
      this.progress = 100;
  }
  this.save(cb);
};

PostSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

PostSchema.methods.downvote = function (cb) {
  this.upvotes -= 1;
  this.save(cb);
};

mongoose.model('Post', PostSchema);
