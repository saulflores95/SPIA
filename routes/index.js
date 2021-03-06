var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');

var Product = mongoose.model('Product');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
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
router.post('/products', auth, function(req, res, next) {
  var product = new Product(req.body);
  product.save(function(err, product){
    if(err){ return next(err); }

    res.json(product);
  });
});
router.param('product', function(req, res, next, id) {
  var query = Poduct.findById(id);

  query.exec(function (err, product){
    if (err) { return next(err); }
    if (!product) { return next(new Error("can't find product")); }

    req.product = product;
    return next();
  });
});
//this may need to be removced if not working END



router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
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
router.put('/posts/:post/produccionConfirmationCapture', auth, function(req, res, next) {
  req.post.produccionConfirmationCapture(function(err, post){
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
