$(document).ready(function(){

	Parse.$ = jQuery;
    //var Pubnub = require('pubnub-3.7.16.min.js');
    var pubnub = PUBNUB({
        subscribe_key: 'sub-c-33095532-8e44-11e5-a52c-02ee2ddab7fe', // always required
        publish_key: 'pub-c-3c545752-df8c-41ac-a105-c69ebf45da40' 
        });   
	// Replace this line with the one on your Quickstart Guide Page
	Parse.initialize("X7LP3L6kwwhLSc7nKGidi9UcnfC41XaOYIxxPbkq", "Dr7rcytsF6MrtE5lZT0olIiV6MvJ55AlgRz1Ntfz");
	var $container = $('#main'),
        $topmenu = $('#topmenu'),
        Category = Parse.Object.extend('Category', {}),
        Categories = Parse.Collection.extend({
			model: Category
		}),
		hand = Handlebars.registerHelper('scripting', function(scriptPath) {
		    return "<script src='" + scriptPath + "' type='text/javascript'></script>";
		});
   var messages = [];
   var player;
   var currentVideo;
    var Roomview = Parse.View.extend({
        template: Handlebars.compile($('#Room').html()),
        events: {
            'click #send': 'publish',
            'keyup #messageToSend': 'enterDown',
            'click #searchButton': 'youtubeQuery',
            'click .clip': 'loadVideo'
        },
        initialize: function(){
                player = new YT.Player('player', {
                    height: '390',
                    width: '640',
                    videoId: 'M7lc1UVf-VE',
                    events: {
                        'onReady': this.onPlayerReady,
                        //'onStateChange': onPlayerStateChange
                    }
                });

            pubnub.subscribe({
                channel: 'chat',
                connect: function(){
                    pubnub.publish ({
                        channel: 'chat',
                        message: Parse.User.current().getUsername() + ' has joined the room.'
                    } );
                },
                message: function(text){
                        console.log('inside subscribe message');
                        messages.push(text);
                        var html ='';
                        for (var i=0; i < messages.length; i++){
                            html += messages[i] + "<br />";
                        }
                        var div = $("#box")[0];
                        $('#box').html(html);
                        div.scrollTop = div.scrollHeight;
                        //$('#box').scrollTop($('box')[0].scrollHeight);
                    }
            });  
        },
        onPlayerReady: function (e){
            e.target.playVideo();
        },
        publish: function(e) {
            e.preventDefault();
            pubnub.publish({
                channel: 'chat',
                message: Parse.User.current().getUsername() +': '+ $('#messageToSend').val(),
                callback: function(m){
                    $('#messageToSend').val('');
                    console.log(m) }
            });
        },
        youtubeQuery: function(e){
            e.preventDefault();
           ytEmbed.init({'block':'searchResults','type':'search','q': $('#videoQuery').val() ,'results': 3, 'player': 'link'});
        },
        loadVideo: function(e){
            e.preventDefault();
            videoId=e.currentTarget.attributes.href.nodeValue.split('v=');
            currentVideo= videoId[1]
            player.loadVideoById(currentVideo);
        },

        enterDown: function(e) {
            if (e.keyCode == 13){
               this.publish(e);
           }
        },

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
        template: Handlebars.compile($('#Category').html()),
        render: function() {
            if (Parse.User.current()) {
                //this.$el.html(this.template(collection));	
                var collection = {category: this.collection.toJSON()};
                this.$el.html(this.template());
            }
            else{
                videoRouter.navigate('', {trigger: true});
            }
        }
    });
    var SignupView = Parse.View.extend({
        template: Handlebars.compile($('#Signup').html()),
        events: {
            'submit #signupform': 'signup',
        },
        signup: function(e){
            console.log('signing up');
            e.preventDefault();
            var data = $(e.target).serializeArray(),
				username = data[0].value,
				password = data[1].value,
				email = data[3].value;
            user = new Parse.User();
            user.set('username', username);
            user.set('password', password);
            user.set('email', email);
            user.signUp(null,{
                success: function (user){
                    console.log('successful signup');
                    videoRouter.navigate('#inheader',{trigger: true});
                    videoRouter.navigate('#categories' ,{trigger: true});
                },
                error: function (user, error){
                    console.log('unsuccessful signup');
                    console.log("inputted username: "+ username);
                    console.log("inputted password: "+ password);
                    console.log("inputted email: "+ email);
                    console.log(error.message);
                }
            });
        },
        render: function() {
            if (Parse.User.current()) {
                videoRouter.navigate('#categories', {trigger: true});
            }
            else{
                this.$el.html(this.template());
            }
        }
    });
    var IndexView = Parse.View.extend({
        template: Handlebars.compile($('#IndexView').html()),
        events: {
            'click #bodysignup': 'enter_signup'
        },
        enter_signup: function(e){
            e.preventDefault();
            console.log("entering signup page");
            videoRouter.navigate('#signup',{trigger: true});
        },
        render: function() {
            if (Parse.User.current()) {
                videoRouter.navigate('#categories', {trigger: true});
            }
            else{
                this.$el.html(this.template());
            }
        }
    });
    
    var inHeaderView = Parse.View.extend({
        template: Handlebars.compile($('#inHeaderView').html()),
        events: {
            'click #logout-button': 'logout',
        },
        logout: function(e){
            e.preventDefault();
            console.log("logging out");
            Parse.User.logOut();
            console.log('successful logout');
            videoRouter.navigate('#outheader', {trigger: true}); 
        },
        render: function() {
            if (Parse.User.current()) {
                this.$el.html(this.template({username: Parse.User.current().getUsername()}));
            }
            else{
                videoRouter.outheader();
            }
        }
    });
    var outHeaderView = Parse.View.extend({
        template: Handlebars.compile($('#outHeaderView').html()),
        events: {
            'submit #signinform': 'signin',
        },
        signin: function(e){
            e.preventDefault();
            console.log('sign in inside header');
            Parse.User.logIn($('#user').val(), $('#pass').val(), {
                success: function(user){
                    videoRouter.inheader();
				    videoRouter.navigate('#categories',{trigger: true});
                },
                error: function (user, error){
                    console.log("given username: "+$('#user').val());
                    console.log("given password: "+$('#pass').val());          
                    console.log(error.message);
                }
            });
        },
        render: function() {
            if (Parse.User.current()) {
                videoRouter.inheader();
            }
            else{
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
            
            headerview = new outHeaderView();
            headerview.render();
            $topmenu.html(headerview.el);
            console.log("made header");
        },	
        // This is where you map functions to urls.
        // Just add '{{URL pattern}}': '{{function name}}'
        routes: {
            '': 'index',
            'signup': 'signup',
            'categories': 'categories',
            'room': 'room',
            'inheader':'inheader',
            'outheader':'outheader'
        },
        index: function() {
            console.log('inside index');
            indexview = new IndexView();
            indexview.render();
            $container.html(indexview.el);
        },
        signup: function(){
            console.log('inside signup');
            signupView = new SignupView();
            signupView.render();
            $container.html(signupView.el);
        },
        categories: function() {
            console.log('inside categories');
            var categoryQuery = new Parse.Query(Category);
            collection= categoryQuery.collection();
            username = Parse.User.current().getUsername();
            collection.fetch().then(function(categories){
            // Render blogs
                var categoriesView = new CategoriesView({ collection: categories, username: username });
				categoriesView.render();
                $container.html(categoriesView.el);
				//$sidebar.html(categoriesView.el);
            })
        },
        room: function (){
            console.log('inside room');
            roomview = new Roomview();
            roomview.render();
            $container.html(roomview.el);
        },
        inheader: function(){
            console.log("logged in header");
            headerview = new inHeaderView();
            headerview.render();
            $topmenu.html(headerview.el);
        },
        outheader: function(){
            console.log("logged out header");
            headerview = new outHeaderView();
            headerview.render();
            $topmenu.html(headerview.el);
        }
    });
    videoRouter = new roomRouter();	
    videoRouter.start({pushState: true});
});