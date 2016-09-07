var app = angular.module('amacApp', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

	$stateProvider.state('home', {
		url : '/home',
		templateUrl : '/home.html',
		controller : 'MainCtrl',
		resolve : {
			postPromise : ['posts',
			function(posts) {
				return posts.getAll();
			}]
		}
	}).state('products', {
		url : '/products',
		templateUrl : '/products.html',
		controller : 'ProdCtrl',
		resolve : {
			productsPromise : ['products',
			function(products) {
				return products.getAll();
			}]
		}
	}).state('posts', {
		url : '/posts/:id',
		templateUrl : '/posts.html',
		controller : 'PostsCtrl',
		resolve : {
			post : ['$stateParams', 'posts',
			function($stateParams, posts) {
				return posts.get($stateParams.id);
			}]

		}
	}).state('login', {
		url : '/login',
		templateUrl : '/login.html',
		controller : 'AuthCtrl',
		onEnter : ['$state', 'auth',
		function($state, auth) {
			if (auth.isLoggedIn()) {
				$state.go('home');
			}
		}]

	}).state('register', {
		url : '/register',
		templateUrl : '/register.html',
		controller : 'AuthCtrl',
		onEnter : ['$state', 'auth',
		function($state, auth) {
			if (auth.isLoggedIn()) {
				$state.go('home');
			}
		}]

	});

	$urlRouterProvider.otherwise('home');
}]);

app.factory('auth', ['$http', '$window',
function($http, $window) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['amac-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['amac-token'];
	}

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};

	auth.currentUserType = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.userType;
		}
	};

	auth.register = function(user) {
		return $http.post('/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function(user) {
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem('amac-token');
	};

	return auth;
}]);

app.factory('products', ['$http', 'auth',
function($http, auth){
  var p = {
    products : []
  };

  p.getAll = function() {
    return $http.get('/products').success(function(data) {
      angular.copy(data, p.products);
    });
  };
  p.create = function(product) {
	  return $http.post('/products', product, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    p.products.push(data);
	  });
	};
	p.get = function(id) {
		//use the express route to grab this post and return the response
		//from that route, which is a json of the post data
		//.then is a promise, a kind of newly native thing in JS that upon cursory research
		//looks friggin sweet; TODO Learn to use them like a boss.  First, this.
		return $http.get('/products/' + id).then(function(res) {
			return res.data;
		});
	};

	return p;

}]);

app.factory('posts', ['$http', 'auth',
function($http, auth) {
	var o = {
		posts : []
	};

	o.getAll = function() {
		return $http.get('/posts').success(function(data) {
			angular.copy(data, o.posts);
		});
	};
	//now we'll need to create new posts
	//uses the router.post in index.js to post a new Post mongoose model to mongodb
	//when $http gets a success back, it adds this post to the posts object in
	//this local factory, so the mongodb and angular data is the same
	//sweet!
	o.create = function(post) {
	  return $http.post('/posts', post, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    o.posts.push(data);
	  });
	};
  o.upvote = function(post) {
	  return $http.put('/posts/' + post._id + '/upvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    post.upvotes += 1;
	  });
	};
	o.ventasConfirmationCapture = function(post) {
	  return $http.put('/posts/' + post._id + '/ventasConfirmationCapture', null, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
		post.ventasConfirmation = true;
	  });
	};
	o.disenoConfirmationCapture = function(post) {
	  return $http.put('/posts/' + post._id + '/disenoConfirmationCapture', null, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
		post.disenoConfirmation = true;
	  });
	};
  o.preConfirmationCapture = function(post) {
	  return $http.put('/posts/' + post._id + '/preConfirmationCapture', null, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
		post.preConfirmation = true;
	  });
	};
  o.planacionConfirmationCapture = function(post) {
	  return $http.put('/posts/' + post._id + '/planacionConfirmationCapture', null, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
		post.planacionConfirmation = true;
	  });
	};
  o.produccionConfirmationCapture = function(post) {
	  return $http.put('/posts/' + post._id + '/produccionConfirmationCapture', null, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
		post.produccionConfirmation = true;
	  });
	};
  o.almacenConfirmationCapture = function(post) {
	  return $http.put('/posts/' + post._id + '/almacenConfirmationCapture', null, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
		post.almacenConfirmation = true;
	  });
	};
  o.prensaConfirmationCapture = function(post) {
    return $http.put('/posts/' + post._id + '/prensaConfirmationCapture', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
    post.prensaConfirmation = true;
    });
  };
  o.acabadosConfirmationCapture = function(post) {
	  return $http.put('/posts/' + post._id + '/acabadosConfirmationCapture', null, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
		post.acabadosConfirmation = true;
	  });
	};
	o.calidadConfirmationCapture = function(post) {
	  return $http.put('/posts/' + post._id + '/calidadConfirmationCapture', null, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
		post.calidadConfirmation = true;
	  });
	};
  o.productoTerConfirmationCapture = function(post) {
    return $http.put('/posts/' + post._id + '/productoTerConfirmationCapture', null, {
    headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
    post.productoTerConfirmation = true;
    });
  };
	o.entregasConfirmationCapture = function(post) {
	  return $http.put('/posts/' + post._id + '/entregasConfirmationCapture', null, {
		headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
		post.entregasConfirmation = true;
	  });
	};
	//downvotes
	o.downvote = function(post) {
	  return $http.put('/posts/' + post._id + '/downvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    post.upvotes -= 1;
	  });
	};
	//grab a single post from the server
	o.get = function(id) {
		//use the express route to grab this post and return the response
		//from that route, which is a json of the post data
		//.then is a promise, a kind of newly native thing in JS that upon cursory research
		//looks friggin sweet; TODO Learn to use them like a boss.  First, this.
		return $http.get('/posts/' + id).then(function(res) {
			return res.data;
		});
	};
	//comments, once again using express
	o.addComment = function(id, comment) {
	  return $http.post('/posts/' + id + '/comments', comment, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  });
	};
  o.upvoteComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    comment.upvotes += 1;
	  });
	};
	//downvote comments
	//I should really consolidate these into one voteHandler function
	o.downvoteComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/downvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    comment.upvotes -= 1;
	  });
	};
	return o;
}]);

app.controller('MainCtrl', ['$scope', 'posts', 'auth',
function($scope, posts, auth) {
	$scope.posts = posts.posts;
	$scope.isLoggedIn = auth.isLoggedIn;
	//setting title to blank here to prevent empty posts
	$scope.title = '';

	$scope.addPost = function() {
		if ($scope.title === '') {
			return;
		}
		posts.create({
			title : $scope.title,
			link : $scope.link,
		});
		//clear the values
		$scope.title = '';
		$scope.link = '';
	};
	$scope.upvote = function(post) {
		posts.upvote(post);
	};

	$scope.downvote = function(post) {
		posts.downvote(post);
	};

}]);

app.controller('ProdCtrl', ['$scope', 'products', 'auth',
function($scope, products, auth) {
	$scope.products = products.products;
	$scope.isLoggedIn = auth.isLoggedIn;
	//setting title to blank here to prevent empty products
	$scope.title = '';

	$scope.hoverIn = function(){
			this.hoverEdit = true;
	};

	$scope.hoverOut = function(){
			this.hoverEdit = false;
	};
	$scope.addProduct = function() {
		if ($scope.title === '') {
			return;
		}
		products.create({
			title : $scope.title,
			quantity: $scope.quantity,
			weight: $scope.weight,
			height: $scope.height,
			description: $scope.description,
			tags: $scope.tags,
			suppplier: $scope.suppplier,
			imgUrl: $scope.imgUrl,

		});
		//clear the values
		$scope.title = '';
		$scope.quantity = '';
		$scope.weight = '';
		$scope.height = '';
		$scope.description = '';
		$scope.tags = '';
		$scope.suppplier = '';
		$scope.imgUrl = '';
	};


}]);

app.controller('PostsCtrl', ['$scope', 'posts', 'post', 'auth',
function($scope, posts, post, auth) {
	$scope.post = post;
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUserType = auth.currentUserType;

	$scope.addComment = function() {
		if ($scope.body === '') {
			return;
		}
		posts.addComment(post._id, {
			body : $scope.body,
			author : 'user'
		}).success(function(comment) {
			$scope.post.comments.push(comment);
		});
		$scope.body = '';
	};
	$scope.upvote = function(comment) {
		posts.upvoteComment(post, comment);
	};

	$scope.downvote = function(comment) {
		posts.downvoteComment(post, comment);
	};


	$scope.ventasConfirmationCapture = function(post) {
		console.log('Ventas Job Done:' + post.ventasConfirmation);
		posts.ventasConfirmationCapture(post);
		window.location.reload(true);
	};

	$scope.disenoConfirmationCapture = function(post) {
		console.log('Diseno Job Done:' + post.disenoConfirmation);
		posts.disenoConfirmationCapture(post);
		window.location.reload(true);

	};

	$scope.preConfirmationCapture = function(post) {
		console.log('Preprensa Job Done:' + post.preConfirmation);
		posts.preConfirmationCapture(post);
		window.location.reload(true);

	};

	$scope.planacionConfirmationCapture = function(post) {
		console.log('Preprensa Job Done:' + post.planacionConfirmation);
		posts.planacionConfirmationCapture(post);
		window.location.reload(true);

	};

	$scope.almacenConfirmationCapture = function(post) {
		console.log('Alamacen Job Done:' + post.alamcenConfirmation);
		posts.almacenConfirmationCapture(post);
		window.location.reload(true);

	};

  $scope.prensaConfirmationCapture = function(post) {
    console.log('Prensa Job Done: ' + post.prensaConfirmation);
    posts.prensaConfirmationCapture(post);
    window.location.reload(true);
  };
	$scope.produccionConfirmationCapture = function(post) {
		console.log('Produccion Job Done:' + post.produccionConfirmation);
		posts.produccionConfirmationCapture(post);
		window.location.reload(true);

	};
	$scope.acabadosConfirmationCapture = function(post) {
		console.log('Acabados Job Done:' + post.acabadosConfirmation);
		posts.acabadosConfirmationCapture(post);
		window.location.reload(true);

	};
	$scope.calidadConfirmationCapture = function(post) {
		console.log('Calidad Job Done:' + post.calidadConfirmation);
		posts.calidadConfirmationCapture(post);
		window.location.reload(true);

	};
  $scope.productoTerConfirmationCapture = function(post){
    console.log('Producto Terminado: ' + post.productoTerConfirmation);
    window.location.reload(true);
  }
	$scope.entregasConfirmationCapture = function(post) {
		console.log('Entregas Job Done:' + post.entregasConfirmation);
		posts.entregasConfirmationCapture(post);
		window.location.reload(true);

	};

	$scope.ventasStyle= function(){
		if(post.ventasConfirmation == true){
			return "border-color:green; color: green; box-shadow: 0 0 10px green;";
		}
	}
	$scope.disenoStyle= function(){
		if(post.disenoConfirmation == true){
			return "border-color:green; color: green; box-shadow: 0 0 10px green;";
		}
	}
  $scope.preStyle = function(){
		if(post.preConfirmation == true){
			return "border-color:green; color: green; box-shadow: 0 0 10px green;";
		}
	}
  $scope.planacionStyle = function(){
		if(post.planacionConfirmation == true){
			return "border-color:green; color: green; box-shadow: 0 0 10px green;";
		}
	}
	$scope.produccionStyle = function(){
		if(post.produccionConfirmation == true){
			return "border-color:green; color: green; box-shadow: 0 0 10px green;";
		}
	}
  $scope.alamcenStyle = function(){
    if(post.almacenConfirmation == true){
      return "border-color:green; color: green; box-shadow: 0 0 10px green;";
    }
  }
  $scope.prensaStyle = function(){
    if(post.prensaConfirmation == true){
      return "border-color:green; color: green; box-shadow: 0 0 10px green;";
    }
  }
	$scope.acabadosStyle = function(){
		if(post.acabadosConfirmation == true){
			return "border-color:green; color: green; box-shadow: 0 0 10px green;";
		}
	}
	$scope.calidadStyle = function(){
		if(post.calidadConfirmation == true){
			return "border-color:green; color: green; box-shadow: 0 0 10px green;";
		}
	}
  $scope.productoTer = function(){
    if(post.productoTerConfirmation == true){
      return "border-color:green; color: green; box-shadow: 0 0 10px green;";
    }
  }
	$scope.entregasStyle = function(){
		if(post.entregasConfirmation == true){
			return "border-color:green; color: green; box-shadow: 0 0 10px green;";
		}
	}


	$scope.department = function(){
		if(post.progress < 20){
			return "No a inicializado";
		}
		if(post.progress == 20){
			return "Diseno";
		}
		if(post.progress == 30){
			return "Almacen";
		}
		if(post.progress == 40 ){
			return "Produccion";
		}
		if(post.progress == 50 ){
			return "Preprensa";
		}
		if(post.progress == 60 ){
			return "Acabados";
		}
		if(post.progress == 70){
			return "Calidad";
		}
		if(post.progress == 90){
			return "Entregas";
		}
		if(post.progress == 100){
			return "Orden Completada :)";
		}
	}


}]);

app.controller('AuthCtrl', ['$scope', '$state', 'auth',
function($scope, $state, auth) {
	$scope.user = {};

	$scope.register = function() {
		auth.register($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
		});
	};

	$scope.logIn = function() {
		auth.logIn($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('home');
		});
	};
}]);

app.controller('NavCtrl', ['$scope', 'auth',
function($scope, auth) {
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
	$scope.logOut = auth.logOut;
	$scope.currentUserType = auth.currentUserType;
}]);

/*app.controller('CatCtrl',
function($scope, $http) {
    $http.get('../sampledb.json').success(function(data) {
        $scope.catalog = data;
    });
});*/
