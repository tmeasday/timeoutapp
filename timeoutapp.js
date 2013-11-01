Posts = new Meteor.Collection('posts')


Router.map(function() {
  this.route('home', {path: '/'})
  
  this.route('delay', {
    path: '/delay',
    where: 'server',
    action: function() {
      var Future = Npm.require('fibers/future');
      
      var future = new Future();
      
      Meteor.setTimeout(function() {
        future.return('done!');
      }, 20 * 1000);
      
      
      return this.response.end(future.wait());
    }
  })
});

if (Meteor.isClient) {
  Meteor.disconnect();
  Meteor.setTimeout(function() {
    Meteor.reconnect();
  }, 30 * 1000);
  
  Template.home.posts = function() {
    return Posts.find();
  }
} else {
  if (Posts.find().count() === 0) {
    Posts.insert({name: 'LOADED'});
  }
}