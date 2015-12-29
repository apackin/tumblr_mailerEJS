var fs = require('fs');
var ejs = require('ejs');
var csvfile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync("email_template.ejs","utf8");

// Authenticate via OAuth
var tumblr = require('tumblr.js');
var clientTumblr = tumblr.createClient({
  consumer_key: 'HUGrAY51o4jqOcrOHbmbNAeKq900ew8QGAyYSdNEkYcOYI30qp',
  consumer_secret: '4VZPxVZUK6MXvxNJPW4SmQXGlQ0Riz7IG8EKK9YvM2NZ2KW7rA',
  token: 'zu0zCJkPYKcAGptj9P7CXJ6YiQshf4CJlPiCgQwiArVrutNawh',
  token_secret: 'mrRUZasLhubuEBpnEh2PRJjAtH45JYXhOfkxoK2Rzw7esDN6ed'
});

//latestPosts.length; i++) {%> <li><a href=<%= latestPosts[i].href %>> <%= latestPosts[i].title

function csvParse(file){
	var arr = file.split("\n");
	var arrKeys = arr[0].split(',');
	var arrObjects = [];

	for(var i = 1; i<arr.length;i++){
		if(arr[i].length>1){
			var arrRow = arr[i].split(',');
			var arrRowObj = {};

			for(var j = 0; j<arrKeys.length; j++){
				arrRowObj[arrKeys[j]] = arrRow[j];
			}

			arrObjects.push(arrRowObj);
		}
	}
	return arrObjects;
}

// requests blog info from tumblr
clientTumblr.posts('apackin', function(err, blog){
  var posts = blog.posts;
  var latestPosts = [];

// if any post is less than 7 days ago than create a new object with .href and .title and push it to latestPosts
  for (var i = 0; i < posts.length; i++) {
  	// (Todays date - Post date) / (milliseconds/day) < 7 days Make it 30 for now 
  	if(((Date.now() - Date.parse(posts[i].date))/86400000)<30){
  		console.log("yes");
  		var obj = {};
  		obj.href = posts[i]['post_url'];
  		obj.title = posts[i]['title'];
  		latestPosts.push(obj);
  	};
  };

  console.log(latestPosts);
  var friendsList = csvParse(csvfile);


	for (var i = 0; i < friendsList.length; i++) {
		// This works, but it would be better if I could add the latestPosts to the template before looping
		friendsList[i].latestPosts = latestPosts; 
		var customizedTemplate = ejs.render(emailTemplate, friendsList[i]);
		 console.log(customizedTemplate);
	};

});