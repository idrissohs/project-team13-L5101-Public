$(function() {

	Parse.$ = jQuery;

	// Replace this line with the one on your Quickstart Guide Page
Parse.initialize("X7LP3L6kwwhLSc7nKGidi9UcnfC41XaOYIxxPbkq", "Dr7rcytsF6MrtE5lZT0olIiV6MvJ55AlgRz1Ntfz");
	var $container = $('.main-container'),
		$sidebar = $('.blog-sidebar'),
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
                Category = Parse.Object.extend('Category', {}) ,
                Categories = Parse.Collection.extend({
			model: Category
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
                LogInView = Parse.Object.extend({
                    template: handlebars.compile($())
                })
                })
 )