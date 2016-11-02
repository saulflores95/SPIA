var app = angular.module('amacApp', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainCtrl',
            resolve: {
                postPromise: ['posts',
                    function(posts) {
                        return posts.getAll();
                    }
                ]
            }
        }).state('products', {
            url: '/products',
            templateUrl: '/products.html',
            controller: 'ProdCtrl',
            resolve: {
                productsPromise: ['products',
                    function(products) {
                        return products.getAll();
                    }
                ]
            }
        }).state('endproducts', {
            url: '/endproducts',
            templateUrl: '/endproducts.html',
            controller: 'EndProdCtrl',
						resolve: {
                endproductsPromise: ['endproducts',
                    function(endproducts) {
                        return endproducts.getAll();
                    }
                ]
            }
        }).state('posts', {
            url: '/posts/:id',
            templateUrl: '/posts.html',
            controller: 'PostsCtrl',
            resolve: {
                post: ['$stateParams', 'posts',
                    function($stateParams, posts) {
                        return posts.get($stateParams.id);
                    }
                ]

            }
        }).state('product', {
            url: '/products/:id',
            templateUrl: '/product.html',
            controller: 'ProductCtrl',
            resolve: {
                product: ['$stateParams', 'products',
                    function($stateParams, products) {
                        return products.get($stateParams.id);
                    }
                ]
            }
        }).state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth',
                function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }
            ]

        }).state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'AuthCtrl',
            onEnter: ['$state', 'auth',
                function($state, auth) {
                    if (auth.isLoggedIn()) {
                        $state.go('home');
                    }
                }
            ]

        });

        $urlRouterProvider.otherwise('home');
    }
]);

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
    }
]);

app.factory('products', ['$http', 'auth',
    function($http, auth) {
        var p = {
            products: []
        };

        p.getAll = function() {
            return $http.get('/products').success(function(data) {
                angular.copy(data, p.products);
            });
        };
        p.create = function(product) {
            return $http.post('/products', product, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
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

        p.add = function(product, newProduct) {
            return $http.put('/products/' + product._id + '/add', newProduct, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                product.quantity += newProduct.diffQuantity;
            });
        };

        p.subtract = function(product, newProduct) {
            return $http.put('/products/' + product._id + '/subtract', newProduct, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                product.quantity -= newProduct.diffQuantity;
            });
        };

        return p;

    }
]);

app.directive('fileModel', ['$parse', function ($parse) {
return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
                scope.fileName = element[0].files[0]

            });
        });
    }
};
}]);

app.factory('posts', ['$http', 'auth',
    function($http, auth) {
        var o = {
            posts: []
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
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                o.posts.push(data);
            });
        };
        o.upvote = function(post) {
            return $http.put('/posts/' + post._id + '/upvote', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.upvotes += 1;
            });
        };
        o.ventasConfirmationCapture = function(post) {
            return $http.put('/posts/' + post._id + '/ventasConfirmationCapture', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.ventasConfirmation = true;
                post.progress += 10;
            });
        };
        o.disenoConfirmationCapture = function(post) {
            return $http.put('/posts/' + post._id + '/disenoConfirmationCapture', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.disenoConfirmation = true;
                post.progress += 10;
            });
        };
        o.preConfirmationCapture = function(post) {
            return $http.put('/posts/' + post._id + '/preConfirmationCapture', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.preConfirmation = true;
                post.progress +=10;
            });
        };
        o.planacionConfirmationCapture = function(post) {
            return $http.put('/posts/' + post._id + '/planacionConfirmationCapture', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.planacionConfirmation = true;
                post.progress += 20;
            });
        };
        o.almacenConfirmationCapture = function(post) {
            return $http.put('/posts/' + post._id + '/almacenConfirmationCapture', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.almacenConfirmation = true;
                post.progress += 10;
            });
        };
        o.prensaConfirmationCapture = function(post) {
            return $http.put('/posts/' + post._id + '/prensaConfirmationCapture', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.prensaConfirmation = true;
                post.progress += 5;

            });
        };
        o.acabadosConfirmationCapture = function(post) {
            return $http.put('/posts/' + post._id + '/acabadosConfirmationCapture', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.acabadosConfirmation = true;
                post.progress += 5;
            });
        };
        o.calidadConfirmationCapture = function(post) {
            return $http.put('/posts/' + post._id + '/calidadConfirmationCapture', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.calidadConfirmation = true;
                post.progress += 10;
            });
        };
        o.productoTerConfirmationCapture = function(post) {
            return $http.put('/posts/' + post._id + '/productoTerConfirmationCapture', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.productoTerConfirmation = true;
                post.progress += 10;
            });
        };
        o.entregasConfirmationCapture = function(post) {
            return $http.put('/posts/' + post._id + '/entregasConfirmationCapture', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                post.entregasConfirmation = true;
                post.progress += 10;
            });
        };
        //downvotes
        o.downvote = function(post) {
            return $http.put('/posts/' + post._id + '/downvote', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
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
        //edit POST title
        o.editPost = function(post, newPost) {
            return $http.put('/posts/' + post._id + '/edit', newPost, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
              post.title = newPost.title;
              post.nombreCliente = newPost.nombreCliente;
              post.dateEntrada = newPost.dateEntrada;
              post.dateImpresion = newPost.dateAcabado;
              post.nombreCliente = newPost.nombreCliente;
              post.dateSalida = newPost.dateSalida;
            });
        };
        //comments, once again using expresss
        o.addComment = function(id, comment) {
            return $http.post('/posts/' + id + '/comments', comment, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            });
        };
        o.upvoteComment = function(post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                comment.upvotes += 1;
            });
        };
        //downvote comments
        //I should really consolidate these into one voteHandler function
        o.downvoteComment = function(post, comment) {
            return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote', null, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                comment.upvotes -= 1;
            });
        };
        return o;
    }
]);

app.factory('endproducts', ['$http', 'auth',
    function($http, auth) {

        var e = {
            endproducts: []
        };

        e.getAll = function() {
            return $http.get('/endproducts').success(function(data) {
                angular.copy(data, e.endproducts);
            });
        };
        e.create = function(endproduct) {
            return $http.post('/endproducts', endproduct, {
                headers: {
                    Authorization: 'Bearer ' + auth.getToken()
                }
            }).success(function(data) {
                e.endproducts.push(data);
            });
        };
        e.get = function(id) {
            //use the express route to grab this post and return the response
            //from that route, which is a json of the post data
            //.then is a promise, a kind of newly native thing in JS that upon cursory research
            //looks friggin sweet; TODO Learn to use them like a boss.  First, this.
            return $http.get('/endproducts/' + id).then(function(res) {
                return res.data;
            });
        };

        return e;

    }
]);

app.controller('MainCtrl', ['$scope', 'posts', 'auth',
    function($scope, posts, auth) {

        $scope.posts = posts.posts;
        $scope.isLoggedIn = auth.isLoggedIn;
        //setting title to blank here to prevent empty posts
        $scope.title = '';
        $scope.addPost = function() {
            if ($scope.title === '') {
                alert('No se agrego la orden');

                return;
            }
            posts.create({
                title: $scope.title,
                nombreCliente: $scope.nombreCliente,
                dateEntrada: $scope.dateEntrada,
                dateImpresion: $scope.dateImpresion,
                dateAcabado: $scope.dateAcabado,
                dateSalida: $scope.dateSalida
            });
            //clear the values
            $scope.title = '';
            $scope.nombreCliente = '';
            $scope.dateEntrada = '';
            $scope.dateAcabado = '';
            $scope.dateSalida = '';
            $scope.dateImpresion = '';
            alert('Orden agregada');

        };
        $scope.upvote = function(post) {
            posts.upvote(post);
        };
        $scope.downvote = function(post) {
            posts.downvote(post);
        };

        $scope.BlinkerActivator = function(post){
          var dateSalida = new Date(post);
          var dateCurrent = new Date();
          var diff = dateSalida - dateCurrent;
          var day = 0;

          if(diff > 0){
            day = Math.abs(diff/86400000).toFixed(2);
          }else{
            day = 0;
          }
          if(day > 0 && day <= 4)
            return true;
        }


          //dateSalida = dateSalida.replace("T00:00:00.000Z", "");
          //  var dateSalida = post.dateSalida.replace(/-/g,'/');

        $('input').filter('#datepicker').datepicker();
        $("#datepicker").keypress(function(event) {
            event.preventDefault();
        });
        $("#datepicker").keydown(function(event) {
            if (event.keyCode == 8) {
                return false;
            }
        });
        $('#datepicker').bind("cut copy paste", function(event) {
            event.preventDefault();
        });
        $('input').filter('#datepicker2').datepicker();
        $("#datepicker2").keypress(function(event) {
            event.preventDefault();
        });
        $("#datepicker2").keydown(function(event) {
            if (event.keyCode == 8) {
                return false;
            }
        });
        $('#datepicker2').bind("cut copy paste", function(event) {
            event.preventDefault();
        });
        $('input').filter('#datepicker3').datepicker();
        $("#datepicker3").keypress(function(event) {
            event.preventDefault();
        });
        $("#datepicker3").keydown(function(event) {
            if (event.keyCode == 8) {
                return false;
            }
        });
        $('#datepicker3').bind("cut copy paste", function(event) {
            event.preventDefault();
        });
        $('input').filter('#datepicker4').datepicker();
        $("#datepicker4").keypress(function(event) {
            event.preventDefault();
        });
        $("#datepicker4").keydown(function(event) {
            if (event.keyCode == 8) {
                return false;
            }
        });
        $('#datepicker4').bind("cut copy paste", function(event) {
            event.preventDefault();
        });
    }
]);

app.controller('ProdCtrl', ['$scope', '$http', 'products', 'auth',
    function($scope, $http, products, auth) {

        setTimeout(function(){$('.show').on('click',function(){
       			$(this).parent().parent().parent().find('.card-reveal').slideToggle('slow');
       	});

       	$('.card-reveal .close').on('click',function(){
       			$(this).parent().parent().parent().find('.card-reveal').slideToggle('slow');
       });}, 300);
        $scope.products = products.products;
        $scope.isLoggedIn = auth.isLoggedIn;
        //setting title to blank here to prevent empty products
        $scope.title = '';

        $scope.subtract = function(product, newProduct) {
            products.subtract(product, newProduct);
            alert('Restado Confirmado!');
        };

        $scope.add = function(product, newProduct) {
            products.add(product, newProduct);
            alert('Suma Exitosa!');

        };


        $scope.hoverIn = function() {
            this.hoverEdit = true;
        };

        $scope.hoverOut = function() {
            this.hoverEdit = false;
        };
        $scope.addProduct = function() {
            if ($scope.title === '') {
                console.log("No se agrego el producto!");
                return;
            }
            var file = $scope.myFile;
            var uploadUrl = '/testupload';
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl,fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
              console.log("success!!");
            })
            .error(function(){
              console.log("error!!");
            });

            var fileName = $scope.fileName.name.toString();
            var dateCreated = Date.now().toString();
            var url = "https://s3.amazonaws.com/spiaimagebuckit/" + fileName;
            console.log($scope.fileName.name);
            console.log(fileName);
            console.log(url);
            console.log($scope.unit);

            products.create({
                title: $scope.title,
                quantity: $scope.quantity,
                weight: $scope.weight,
                unit: $scope.unit,
                height: $scope.height,
                description: $scope.description,
                tags: $scope.tags,
                suppplier: $scope.suppplier,
                fileName: $scope.fileName.name,
                url : url,
            });

            //clear the values
            $scope.title = '';
            $scope.quantity = '';
            $scope.weight = '';
            $scope.height = '';
            $scope.description = '';
            $scope.unit ='';
            $scope.tags = '';
            $scope.suppplier = '';
            $scope.imgUrl = '';
            alert('Producto agregado.');
        };

    }
]);

app.controller('ProductCtrl', ['$scope', 'products', 'product', 'auth',
    function($scope, products, product, auth) {
        $scope.product = product;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUserType = auth.currentUserType;
        $scope.editPost = function() {
            console.log('Edit Post Form Pressed!')
            posts.editPost(post, {
                title: $scope.post.title,
                nombreCliente: $scope.post.nombreCliente,
                dateEntrada: $scope.post.dateEntrada,
                dateImpresion: $scope.post.dateImpresion,
                dateAcabado: $scope.post.dateAcabado,
                dateSalida: $scope.post.dateSalida
            });
        };

    }
]);

app.controller('PostsCtrl', ['$scope', 'posts', 'post', 'auth',
    function($scope, posts, post, auth) {
        $scope.post = post;
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUserType = auth.currentUserType;
      //  $scope.dateAcabadosDisplay = post.dateAcabado.toISOString().substring(0, 10);
      //  $scope.dateImpresionDisplay = post.dateImpresion.toISOString().substring(0, 10);
      //  $scope.dateSalidaDisplay = post.dateSalida.toISOString().substring(0, 10);

      $scope.DateComparer = function(){
        //dateSalida = dateSalida.replace("T00:00:00.000Z", "");
        //  var dateSalida = post.dateSalida.replace(/-/g,'/');
        var dateSalida = new Date(post.dateSalida);
        var dateCurrent = new Date();
        var diff = dateSalida - dateCurrent;
        var day = 0;
        if(diff > 0){
          var day = Math.abs(diff/86400000).toFixed(2);
        }else{

        }
        return day;
      }


        $scope.editPost = function() {
            console.log('Edit Post Form Pressed!')
            posts.editPost(post, {
                title: $scope.post.title,
                nombreCliente: $scope.post.nombreCliente,
                dateEntrada: $scope.post.dateEntrada,
                dateImpresion: $scope.post.dateImpresion,
                dateAcabado: $scope.post.dateAcabado,
                dateSalida: $scope.post.dateSalida
            });
        };
          /*
            posts.editPost(post._id,{
              title: $scope.title,
            }).success(function(post) {
                //$scope.post.put(post);
                console.log(post.title);
            });
            */
        $scope.addComment = function() {
            if ($scope.body === '') {
                return;
            }
            posts.addComment(post._id, {
                body: $scope.body,
                author: 'user'
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
          //  window.location.reload(true);
        };

        $scope.disenoConfirmationCapture = function(post) {
            console.log('Diseno Job Done:' + post.disenoConfirmation);
            posts.disenoConfirmationCapture(post);
      //      window.location.reload(true);

        };

        $scope.preConfirmationCapture = function(post) {
            console.log('Preprensa Job Done:' + post.preConfirmation);
            posts.preConfirmationCapture(post);
        //    window.location.reload(true);

        };

        $scope.planacionConfirmationCapture = function(post) {
            console.log('Preprensa Job Done:' + post.planacionConfirmation);
            posts.planacionConfirmationCapture(post);
          //  window.location.reload(true);

        };

        $scope.almacenConfirmationCapture = function(post) {
            console.log('Alamacen Job Done:' + post.alamcenConfirmation);
            posts.almacenConfirmationCapture(post);
            //window.location.reload(true);

        };

        $scope.prensaConfirmationCapture = function(post) {
            console.log('Prensa Job Done: ' + post.prensaConfirmation);
            posts.prensaConfirmationCapture(post);
            //window.location.reload(true);
        };
        $scope.acabadosConfirmationCapture = function(post) {
            console.log('Acabados Job Done:' + post.acabadosConfirmation);
            posts.acabadosConfirmationCapture(post);
            //window.location.reload(true);

        };
        $scope.calidadConfirmationCapture = function(post) {
            console.log('Calidad Job Done:' + post.calidadConfirmation);
            posts.calidadConfirmationCapture(post)   ;
            //window.location.reload(true);

        };
        $scope.productoTerConfirmationCapture = function(post) {
            console.log('Producto Terminado: ' + post.productoTerConfirmation);
            posts.productoTerConfirmationCapture(post);
            //window.location.reload(true);
        }
        $scope.entregasConfirmationCapture = function(post) {
            console.log('Entregas Job Done:' + post.entregasConfirmation);
            posts.entregasConfirmationCapture(post);
            //window.location.reload(true);
        };

        $scope.ventasStyle = function() {
            if (post.ventasConfirmation == true) {
                return "border-color:green; color: green; box-shadow: 0 0 10px green;";
            }
        }
        $scope.disenoStyle = function() {
            if (post.disenoConfirmation == true) {
                return "border-color:green; color: green; box-shadow: 0 0 10px green;";
            }
        }
        $scope.preStyle = function() {
            if (post.preConfirmation == true) {
                return "border-color:green; color: green; box-shadow: 0 0 10px green;";
            }
        }
        $scope.planacionStyle = function() {
            if (post.planacionConfirmation == true) {
                return "border-color:green; color: green; box-shadow: 0 0 10px green;";
            }
        }
        $scope.alamcenStyle = function() {
            if (post.almacenConfirmation == true) {
                return "border-color:green; color: green; box-shadow: 0 0 10px green;";
            }
        }
        $scope.prensaStyle = function() {
            if (post.prensaConfirmation == true) {
                return "border-color:green; color: green; box-shadow: 0 0 10px green;";
            }
        }
        $scope.acabadosStyle = function() {
            if (post.acabadosConfirmation == true) {
                return "border-color:green; color: green; box-shadow: 0 0 10px green;";
            }
        }
        $scope.calidadStyle = function() {
            if (post.calidadConfirmation == true) {
                return "border-color:green; color: green; box-shadow: 0 0 10px green;";
            }
        }
        $scope.productoTerStyle = function() {
            if (post.productoTerConfirmation == true) {
                return "border-color:green; color: green; box-shadow: 0 0 10px green;";
            }
        }
        $scope.entregasStyle = function() {
            if (post.entregasConfirmation == true) {
                return "border-color:green; color: green; box-shadow: 0 0 10px green;";
            }
        }


        $scope.department = function() {
            if (post.progress < 10) {
                return "No a inicializado";
            }
            if (post.progress == 10) {
                return "Diseno";
            }
            if (post.progress == 20) {
                return "Preprensa";
            }
            if (post.progress == 30) {
                return "Planacion";
            }
            if (post.progress == 50) {
                return "Almacen";
            }
            if (post.progress == 60) {
                return "Prensa";
            }
            if (post.progress == 65) {
                return "Acabdos";
            }
            if (post.progress == 70) {
                return "Producto Terminado";
            }
            if (post.progress == 80) {
                return "Calidad";
            }
            if (post.progress == 90) {
                return "Entregas";
            }
            if (post.progress == 100) {
                return "Orden Completada :)";
            }
        }

        $('input').filter('#datepicker').datepicker();
        $("#datepicker").keypress(function(event) {
            event.preventDefault();
        });
        $("#datepicker").keydown(function(event) {
            if (event.keyCode == 8) {
                return false;
            }
        });
        $('#datepicker').bind("cut copy paste", function(event) {
            event.preventDefault();
        });
        $('input').filter('#datepicker2').datepicker();
        $("#datepicker2").keypress(function(event) {
            event.preventDefault();
        });
        $("#datepicker2").keydown(function(event) {
            if (event.keyCode == 8) {
                return false;
            }
        });
        $('#datepicker2').bind("cut copy paste", function(event) {
            event.preventDefault();
        });
        $('input').filter('#datepicker3').datepicker();
        $("#datepicker3").keypress(function(event) {
            event.preventDefault();
        });
        $("#datepicker3").keydown(function(event) {
            if (event.keyCode == 8) {
                return false;
            }
        });
        $('#datepicker3').bind("cut copy paste", function(event) {
            event.preventDefault();
        });
        $('input').filter('#datepicker4').datepicker();
        $("#datepicker4").keypress(function(event) {
            event.preventDefault();
        });
        $("#datepicker4").keydown(function(event) {
            if (event.keyCode == 8) {
                return false;
            }
        });
        $('#datepicker4').bind("cut copy paste", function(event) {
            event.preventDefault();
        });


    }
]);

app.controller('EndProdCtrl', ['$scope', 'endproducts', '$http', 'auth',
    function($scope, endproducts, $http, auth) {
          setTimeout(function(){$('.show').on('click',function(){
         			$(this).parent().parent().parent().find('.card-reveal').slideToggle('slow');
         	});

         	$('.card-reveal .close').on('click',function(){
         			$(this).parent().parent().parent().find('.card-reveal').slideToggle('slow');
         });}, 300);

        $scope.endproducts = endproducts.endproducts;
        $scope.isLoggedIn = auth.isLoggedIn;
        //setting title to blank here to prevent empty products
        $scope.title = '';

        $scope.hoverIn = function() {
            this.hoverEdit = true;
        };

        $scope.hoverOut = function() {
            this.hoverEdit = false;
        };



        $scope.addProduct = function() {
            if ($scope.client === '') {
                alert('No se agrego el producto');
                return;
            }
            var file = $scope.myFile;
            var uploadUrl = '/testupload';
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl,fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
              console.log("success!!");
            })
            .error(function(){
              console.log("error!!");
            });

            var fileName = $scope.fileName.name.toString();
            var dateCreated = Date.now().toString();
            var url = "https://s3.amazonaws.com/spiaimagebuckit/" + fileName;
            console.log($scope.fileName.name);
            console.log(fileName);
            console.log(url);

            endproducts.create({
                client: $scope.client,
                partNumber: $scope.partNumber,
                quantity: $scope.quantity,
                price: $scope.price,
                unit: $scope.unit,
                url: url,
                fileName:fileName,
            });
            //clear the values
            $scope.client = '';
            $scope.partNumber = '';
            $scope.weight = '';
            $scope.price = '';
            $scope.unit = '';
            alert('Producto agregado.');
        };


    }
]);

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
    }
]);

app.controller('NavCtrl', ['$scope', 'auth',
    function($scope, auth) {
        $scope.isLoggedIn = auth.isLoggedIn;
        $scope.currentUser = auth.currentUser;
        $scope.logOut = auth.logOut;
        $scope.currentUserType = auth.currentUserType;
      }
]);

/*
app.controller('CatCtrl',
function($scope, $http) {
    $http.get('../sampledb.json').success(function(data) {
        $scope.catalog = data;
    });
});
*/
