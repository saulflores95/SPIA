var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
  title: String,
  nombreCliente: String,
  partNumber:String,
  quantity: {type: Number, default: 0},
  price: {type: Number, default: 0},
  upvotes: {type: Number, default: 0},
  cancelOrder: {type: Boolean, default: false},
  ventasConfirmation: {type: Number, default: 0},
  disenoConfirmation: {type: Number, default: 0},
  almacenConfirmation: {type: Number, default: 0},
  preConfirmation: {type: Number, default: 0},
  acabadosConfirmation: {type: Number, default: 0},
  planeacionConfirmation: {type: Number, default: 0},
  calidadConfirmation: {type: Number, default: 0},
  productoTerConfirmation: {type: Number, default: 0},
  prensaConfirmation: {type: Number, default: 0},
  entregasConfirmation: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  progress: {type: Number, default:0},
  dateEntrada: { type: Date, default: Date.now },
  dateImpresion: { type: Date, default: Date.now },
  dateAcabado: { type: Date, default: Date.now },
  dateSalida: { type: Date, default: Date.now },


});

PostSchema.methods.ventasConfirmationCapture = function(cb) {
  if(this.ventasConfirmation === 0){
    this.progress += 10;
    this.ventasConfirmation++;
  }else if (this.ventasConfirmation === 1) {
    this.ventasConfirmation++;
  }else{
    this.ventasConfirmation =  2
  }
  console.log(this.ventasConfirmation);
  this.save(cb);
};

PostSchema.methods.disenoConfirmationCapture = function(cb) {
  if(this.disenoConfirmation === 0){
    this.progress += 10;
    this.disenoConfirmation++;
  }else if (this.disenoConfirmation === 1) {
    this.disenoConfirmation++;
  }else{
    this.disenoConfirmation =  2
  }
  console.log(this.disenoConfirmation);
  this.save(cb);
};

PostSchema.methods.preConfirmationCapture = function(cb) {
  if(this.preConfirmation === 0){
    this.progress += 10;
    this.preConfirmation++;
  }else if (this.preConfirmation === 1) {
    this.preConfirmation++;
  }else{
    this.preConfirmation =  2
  }
  console.log(this.preConfirmation);
  this.save(cb);
};

PostSchema.methods.planeacionConfirmationCapture = function(cb) {
  if(this.planeacionConfirmation === 0){
    this.progress += 20;
    this.planeacionConfirmation++;
  }else if (this.planeacionConfirmation === 1) {
    this.planeacionConfirmation++;
  }else{
    this.planeacionConfirmation =  2
  }
  console.log(this.planeacionConfirmation);
  this.save(cb);
};

PostSchema.methods.almacenConfirmationCapture = function(cb) {
  if(this.almacenConfirmation === 0){
    this.progress += 10;
    this.almacenConfirmation++;
  }else if (this.almacenConfirmation === 1) {
    this.almacenConfirmation++;
  }else{
    this.almacenConfirmation =  2
  }
  console.log(this.almacenConfirmation);
  this.save(cb);
};

PostSchema.methods.prensaConfirmationCapture = function(cb) {
  if(this.prensaConfirmation === 0){
    this.progress += 5;
    this.prensaConfirmation++;
  }else if (this.prensaConfirmation === 1) {
    this.prensaConfirmation++;
  }else{
    this.prensaConfirmation =  2
  }
  console.log(this.prensaConfirmation);
  this.save(cb);
};

PostSchema.methods.acabadosConfirmationCapture = function(cb) {
  if(this.acabadosConfirmation === 0){
    this.progress += 5;
    this.acabadosConfirmation++;
  }else if (this.acabadosConfirmation === 1) {
    this.acabadosConfirmation++;
  }else{
    this.acabadosConfirmation =  2
  }
  console.log(this.prensaConfirmation);
  this.save(cb);
};

PostSchema.methods.calidadConfirmationCapture = function(cb) {
  if(this.calidadConfirmation === 0){
    this.progress += 10;
    this.calidadConfirmation++;
  }else if (this.calidadConfirmation === 1) {
    this.calidadConfirmation++;
  }else{
    this.calidadConfirmation =  2
  }
  console.log(this.calidadConfirmation);
  this.save(cb);
};

PostSchema.methods.productoTerConfirmationCapture = function(cb) {
  if(this.productoTerConfirmation === 0){
    this.productoTerConfirmation++;
    this.progress += 10;
  }else if (this.productoTerConfirmation === 1) {
    this.productoTerConfirmation++;
  }else{
    this.productoTerConfirmation =  2
  }
  console.log(this.productoTerConfirmation);
  this.save(cb);
};

PostSchema.methods.entregasConfirmationCapture = function(cb) {
  if(this.entregasConfirmation === 0){
    this.progress += 10;
    this.entregasConfirmation++;
  }else if (this.entregasConfirmation === 1) {
    this.entregasConfirmation++;
  }else{
    this.entregasConfirmation =  2
  }

  if(this.progress > 100){
      this.progress = 100;
  }
  console.log(this.entregasConfirmation);
  this.save(cb);
};

PostSchema.methods.cancel = function(cb) {
  this.cancelOrder = true;
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

PostSchema.methods.edit = function (newPost ,cb) {
  this.title = newPost.title;
  this.nombreCliente = newPost.nombreCliente;
  this.dateEntrada = newPost.dateEntrada;
  this.dateImpresion = newPost.dateImpresion;
  this.dateAcabado = newPost.dateAcabado;
  this.dateSalida = newPost.dateSalida;
  this.partNumber = newPost.partNumber;
  this.quantity = newPost.quantity;
  this.save(cb);
};


mongoose.model('Post', PostSchema);
