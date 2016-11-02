var path = require('path');
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');

var Product = mongoose.model('Product');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var EndProduct = mongoose.model('EndProduct');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var fs = require('fs');
var S3FS = require('s3fs');
var s3fsImpl = new S3FS('spiaimagebuckit',{
  accessKeyId : 'AKIAJCWADR7A2YLOIWOA',
  secretAccessKey :  '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'
});

s3fsImpl.create();

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.post('/testupload', upload.single('file'), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  console.log(req.file);

  var file = req.file;
  var filePath = path.resolve(__dirname, '..', file.path)
  var stream = fs.createReadStream(filePath);
  var FileName = Date.now().toString() + '-' + file.originalname;
  console.log(FileName);

  return s3fsImpl.writeFile(FileName, stream).then(function(){
    fs.unlink(file.path, function(err){
      if(err)
        console.error(err);
    })
      res.redirect('/#/products');
  });
})

router.post('/upload', upload.single('file'), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  console.log(req.file);
  console.log(req.body);
  res.json({success:true});
});



router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){
      return next(err);
    }

    res.json(posts);
  });
});

router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
    return next();
  });
});
//this may need to be removced if not working START
router.get('/products', function(req, res, next) {
  Product.find(function(err, products){
    if(err){
      return next(err);
    }

    res.json(products);
  });
});

router.post('/products', upload.single('image'),function(req, res, next) {

  var product = new Product(req.body);
  product.save(function(err, product){
    if(err){ return next(err); }

    res.json(product);
  });

});


router.param('product', function(req, res, next, id) {
  var query = Product.findById(id);

  query.exec(function (err, product){
    if (err) { return next(err); }
    if (!product) { return next(new Error("can't find product")); }

    req.product = product;
    return next();
  });
});
//this may need to be removced if not working END


//this may need to be removced if not working START
router.get('/endproducts', function(req, res, next) {
  EndProduct.find(function(err, endproducts){
    if(err){
      return next(err);
    }

    res.json(endproducts);
  });
});
router.post('/endproducts', auth, function(req, res, next) {
  var endproducts = new EndProduct(req.body);
  endproducts.save(function(err, product){
    if(err){ return next(err); }

    res.json(endproducts);
  });
});
router.param('endproduct', function(req, res, next, id) {
  var query = EndProduct.findById(id);

  query.exec(function (err, endproduct){
    if (err) { return next(err); }
    if (!endproduct) { return next(new Error("no se encuentro producto terminadno")); }

    req.endproduct = endproduct;
    return next();
  });
});
//this may need to be removced if not working END


router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    res.json(post);
  });
});
router.put('/posts/:post/edit', auth, function(req, res, next) {

  var newPost = req.body;

  req.post.edit(newPost, function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });

});

router.put('/posts/:post/ventasConfirmationCapture', auth, function(req, res, next) {
  req.post.ventasConfirmationCapture(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/disenoConfirmationCapture', auth, function(req, res, next) {
  req.post.disenoConfirmationCapture(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/planacionConfirmationCapture', auth, function(req, res, next) {
  req.post.planacionConfirmationCapture(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/productoTerConfirmationCapture', auth, function(req, res, next) {
  req.post.productoTerConfirmationCapture(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/almacenConfirmationCapture', auth, function(req, res, next) {
  req.post.almacenConfirmationCapture(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/prensaConfirmationCapture', auth, function(req, res, next) {
  req.post.prensaConfirmationCapture(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/preConfirmationCapture', auth, function(req, res, next) {
  req.post.preConfirmationCapture(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/acabadosConfirmationCapture', auth, function(req, res, next) {
  req.post.acabadosConfirmationCapture(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/calidadConfirmationCapture', auth, function(req, res, next) {
  req.post.calidadConfirmationCapture(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/entregasConfirmationCapture', auth, function(req, res, next) {
  req.post.entregasConfirmationCapture(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});
router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
})
router.put('/posts/:post/downvote', auth, function(req, res, next) {
  req.post.downvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
})
router.post('/posts/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
})
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
})
router.put('/posts/:post/comments/:comment/downvote', auth, function(req, res, next) {
  req.comment.downvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
})


router.get('/products/:product', function(req, res, next) {
  req.product.populate('products', function(err, product) {
    res.json(product);
  });
});


router.put('/products/:product/add', auth, function(req, res, next) {
  var newProduct = req.body;
  req.product.add(newProduct, function(err, product){zsa
    if (err) { return next(err); }

    res.json(product);
  });
})


router.put('/products/:product/subtract', auth, function(req, res, next) {
  var newProduct = req.body;
  req.product.subtract(newProduct, function(err, product){
    if (err) { return next(err); }

    res.json(product);
  });
})

/*Segment used previously
router.get('/products', function(req, res, next) {
  Product.find(function(err, products){
    if(err){
      return next(err);
    }
    res.json(products);
  });
})*/

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.userType = req.body.userType;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

console.log('calling passport)');
  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
