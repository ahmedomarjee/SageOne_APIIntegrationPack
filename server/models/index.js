var fs = require('fs'),
	path = require('path');

var files = fs.readdirSync(__dirname);
for (var i = 0; i < files.length; i++) {
	if (files[i] != 'index.js')
		require('./'+files[i]);
}