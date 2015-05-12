var express  = require('express'),
	app      = express(),
	mongoose = require('mongoose'),
	config = require('./config/config');

require('./config/mongoose')(config);
require('./models');
require('./config/express')(express,app);
require('./routes/')(app);

app.listen(config.port);