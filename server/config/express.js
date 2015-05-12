var helmet = require('helmet'),
	compression = require('compression'),
	bodyParser   = require('body-parser');//,

module.exports = function(express,app)
{
	app.get('/~*/*', function(req,res) {
		res.statusCode = 404;
		res.send('404');
	});
	
	app.use(helmet());
	app.use(function(req,res,next){
		res.removeHeader('Cache-Control');
        next();
	});

	app.use(compression());
	app.use(express.static('public'));
	app.use(bodyParser.json({limit: '2mb'}));
	app.use(bodyParser.urlencoded({extended: true}));
}