var fs = require('fs'),
	path = require('path'),
	config = require('../config/config'),
	expressJwt = require('express-jwt')({secret:config.secret});

module.exports = function(app)
{
	var files = fs.readdirSync(__dirname);
	for (var i = 0; i < files.length; i++) {		
		if (files[i] != 'index.js')
		{
			var parts = files[i].split('.');
			var route ='/'+parts.splice(0,parts.length-2,'').join('/');
			var router = require('./'+files[i]);
			if (route.indexOf('/public') != 0)
				app.use(route+router.stack[0].route.path,expressJwt);
			else
				route = route.replace('public','').replace('//','/');
			app.use(route,router);				
		}
	}

	app.all('*', function(req,res) {
		res.statusCode = 404;
		res.send('404');
	});
};