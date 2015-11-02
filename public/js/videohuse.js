$(document).ready(function(){

	Parse.$ = jQuery;

	// Replace this line with the one on your Quickstart Guide Page
	Parse.initialize("X7LP3L6kwwhLSc7nKGidi9UcnfC41XaOYIxxPbkq", "Dr7rcytsF6MrtE5lZT0olIiV6MvJ55AlgRz1Ntfz");
	var $container = $('#main'),
		$sidebar = $('#chat'),
		$topbar = $('#topmenu'),
        Category = Parse.Object.extend('Category', {}),
        Room = Parse.Object.extend('Room', {
            update: function(data){
                if (!this.get('ACL')) {
			    var videoACL = new Parse.ACL(Parse.User.current());
                videoACL.setPublicReadAccess(true);
				// Set this ACL object to the ACL field
				this.setACL(blogACL);
				}
                var category = new Category();
                category.id = data.category;
                                
                this.set({
                    'title': data.title,
                    'category': data.category,
                    'user': Parse.User.current(),
                }).save(null, {
                    success: function(Room){
                        videoRouter.navigate('#/room' , {trigger: true});
                    },
                    error: function(Room, error){
                        console.log('error is '+ error.message)
                    }
                });              
            }
        }),
                    
		Rooms = Parse.Collection.extend({
		    model: Room
		}),
                    
        Category = Parse.Object.extend('Category', {}) ,
        Categories = Parse.Collection.extend({
			model: Category
		}),
               
        CategoriesView = Parse.View.extend({
            template: Handlebars.compile($('#Category').html()),
            render: function() {
                this.$el.html(this.template());
		    }
        }),
        
        Roomview = Parse.View.extend({
            template: Handlebars.compile($('#Room').html()),
            render: function() {
                var collection ={
                    username: this.options.username,
                    room: this.collection.toJSON()
                }
            }
        }),
                    
		SignUpView = Parse.View.extend({
		    template: Handlebars.compile($('#signup').html()),
		    events: {
				'submit #register-form': 'signup'
			},
		    signup: function(e){

                e.preventDefault();
                var data = $(e.target).serializeArray(),
				username = data[0].value,
				password = data[1].value,
				repassword=data[2].value,
				email = data[3].value;
                
                if (password == repassword) {
                    Parse.User.signUp(username, password, {email: email}, {
                        success: function (user){
                            videoRouter.navigate('#',{trigger: true});
                        },
                        error: function(user, error){
                            console.log(error.message);
                        }
                    })
                }
                else {
                    document.getElementById("message").innerHTML = "passwords do not match";
                    videoRouter.navigate('#/signup', {trigger: true});
                }
            },
            render: function() {
                this.$el.html(this.template());
		    }
		}),
                    
		HeaderView = Parse.View.extend({
		    template: Handlebars.compile($('#HeaderView').html()),
		    events: {
				'submit #topcorner': 'login',
				'click #homemenu': 'home',
				'click #signupmenu':'signup',
				'submit #logoutform' :'logout',
                'click #categoriesmenu' :'categories'
			},
		    login: function(e) {
                e.preventDefault();
                var data = $(e.target).serializeArray(),
				username = data[0].value,
				password = data[1].value;
                Parse.User.logIn(username, password, {
				    succes: function(user){
                        console.log("inside headerview login");
                        videoRouter.navigate('#',{trigger:true});
                    },
				    error: function (user, error){
                        console.log(error.message);
                    }
                });	
            },
            logout: function(e) {
                e.preventDefault();
                Parse.User.logOut();
                console.log('inside logout in headerview');
                videoRouter.navigate('#', {trigger: true});
		    },
		    home: function(e){
                e.preventDefault();
                videoRouter.navigate('#', {trigger: true});
		    },
		    signup: function(e){
                e.preventDefault();
                videoRouter.navigate('#/signup' ,{trigger: true});
		    },
            categories: function(e){
                e.preventDefault();
                videoRouter.navigate('#/categories', {trigger: true});
            },
		    render: function() {
                if (Parse.User.current()) {
                    var collection={
                        username: this.options.username
                    };
                    this.$el.html(this.template({username: Parse.User.current().get('username')}));
                }
                else {
                    this.$el.html(this.template());
                }
		    }
        }),
                    
		IndexView = Parse.View.extend({
		    template: Handlebars.compile($('#IndexView').html()),
		    events: {
			'click #bodysignup': 'signup'
		    },
		    signup: function(e){
			e.preventDefault();
			console.log("indexview");
			videoRouter.navigate('#signup', {trigger: true});
		    },
		    render: function(){
			this.$el.html(this.template());
		    }
		}),
                    
		roomRouter = Parse.Router.extend({
		
			// Here you can define some shared variables
			initialize: function(options){
				this.room = new Room();
				this.categories = new Categories();
			},
			
			// This runs when we start the router. Just leave it for now.
			start: function(){
				console.log("inside start of the router");
				Parse.history.start({pushState: true});
				this.navigate('#', { trigger: true });

			},
				
			// This is where you map functions to urls.
			// Just add '{{URL pattern}}': '{{function name}}'
			routes: {
				'': 'index',
				'logout': 'logout',
				'signup': 'signup',
                'categories': 'categories'},
			index: function() {
			    var currentuser= Parse.User.current();
				if (currentuser) {
				    console.log("inside index with current");
				    header = new HeaderView({
				    username: currentuser.get('username'),
				    });
				    body= new Roomview ({});
				    $container.html(body.el);
				}
				else{
				    console.log("inside index");
				    header = new HeaderView({});
				    body= new IndexView({});
				    body.render();
				    $container.html(body.el);
				}
				header.render();
				$topbar.html(header.el);
    			},
			signup: function() {
			    console.log("inside signup router");
			    if (!Parse.User.current()) {
				
				signup = new SignUpView({}),
				signup.render();
				$container.html(signup.el);
			    }
			},
			logout: function() {
			    console.log("inside logout router");
			    Parse.User.logOut();
			    console.log('inside logout');
			    this.navigate('#/signup', { trigger: true }); 
			},
            categories: function(){
			    console.log('inside categories');
			    categories = new CategoriesView({}),
				categories.render();
				$container.html(categories.el);
            }
        }),
        videoRouter = new roomRouter();
    videoRouter.start({pushState: true});

});

