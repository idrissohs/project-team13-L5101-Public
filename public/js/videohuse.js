$(document).ready(function(){

	Parse.$ = jQuery;

	// Replace this line with the one on your Quickstart Guide Page
	Parse.initialize("X7LP3L6kwwhLSc7nKGidi9UcnfC41XaOYIxxPbkq", "Dr7rcytsF6MrtE5lZT0olIiV6MvJ55AlgRz1Ntfz");
	var $container = $('#main'),
		$sidebar = $('.category-sidebar'),
        Category = Parse.Object.extend('Category', {}),
        Categories = Parse.Collection.extend({
			model: Category
		}),
		hand = Handlebars.registerHelper('scripting', function(scriptPath) {
		    return "<script src='" + scriptPath + "' type='text/javascript'></script>";
		});
        var Roomview = Parse.View.extend({
            template: Handlebars.compile($('#Room').html()),
            render: function() {
				if (Parse.User.current()) {
			    	this.$el.html(this.template());
				}
				else{
			   		videoRouter.navigate('', {trigger: true});
				}
            }
        });
		var CategoriesView = Parse.View.extend({
		    template: Handlebars.compile($('#Categories').html()),
		    render: function() {
				var collection = { category: this.collection.toJSON() };
				this.$el.html(this.template(collection));	
		    }
		});
		var IndexView = Parse.View.extend({
		    template: Handlebars.compile($('#IndexView').html()),
		    events: {
				'submit #signupform': 'signup',
				'submit #signinform': 'signin',
				'submit #logoutform': 'logout'
		    },
		    logout: function(e){
				e.preventDefault();
				console.log("logging out");
				videoRouter.navigate('logout',{trigger: true});
		    },
		    signup: function(e){
				e.preventDefault();
				console.log('indexview');
				var data = $(e.target).serializeArray(),
					username = data[0].value,
					password = data[1].value,
					email = data[2].value;
				user = new Parse.User();
				user.set('username', username);
				user.set('password', password);
				user.set('email', email);
				user.signUp(null,{
			    	success: function (user){
						console.log('success');
						videoRouter.navigate('room' ,{trigger: true});
			    	},
			    	error: function (user, error){
						console.log(error.message);
			 	 	}
				});
		    },
		    signin: function(e){
				e.preventDefault();
				console.log('sign in inside index view');
		       	Parse.User.logIn($('#inputUser').val, $('#inputPassword').val, {
			    	success: function(user){
						videoRouter.navigate('room',{trigger: true});
			    	},
			    	error: function (user, error){
						console.log(error.message);
			    	}
				});
		    },
		    render: function(){
				if (Parse.User.current()) {
			    	this.$el.html(this.template({username: Parse.User.current().get('username')}));
				}
				else {
			    	this.$el.html(this.template());
				}
		    }
		});
		roomRouter = Parse.Router.extend({
		
			// Here you can define some shared variables
			initialize: function(options){
				this.categories = new Categories();
			},
			
			// This runs when we start the router. Just leave it for now.
			start: function(){
				console.log("inside start of the router");
				Parse.history.start({pushState: true});
				this.navigate('', {trigger: true});

			},	
			// This is where you map functions to urls.
			// Just add '{{URL pattern}}': '{{function name}}'
			routes: {
				'': 'index',
				'categories': 'categories',
				'room': 'room',
				'logout': 'logout'
			},
			index: function() {
				console.log('inside index');
			    indexview= new IndexView ();
			    indexview.render();
			    $container.html(indexview.el);
    		},
			categories: function() {
			    var categoryQuery = new Parse.Query(Category);
			    collection= categoryQuery.collection();
			    collection.fetch().then(function(categories){
					// Render blogs
					var categoriesview = new CategoriesView({ collection: categories });
					categoriesview.render();
					$sidebar.html(categoriesview.el);
				})
			},
			room: function (){
			    console.log('inside room');
			    roomview = new Roomview();
			    roomview.render();
			    $container.html(roomview.el);
			},
			logout: function(){
			    console.log('inside logout router');
			    Parse.User.logOut().then(
			    	function(){
						console.log('successful logout');
				    	this.navigate('',{trigger: true});
			    	},
			    	function(error){
						console.log('unsuccessful logout');
				    	console.log(error.message);
			    	}
			    );
			} 		
        });
		videoRouter = new roomRouter();	
		videoRouter.start({pushState: true});

});
