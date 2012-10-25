/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    os = require("os"),
    redis = require('redis'),
	cluster = require("cluster"),
	socketio = require('socket.io'),
	redisStore = require('socket.io/lib/stores/redis');

/**
 * Application
 */
if (cluster.isMaster) {

	var cpu = require('./plugins/cpu.js');
	var pubServer = redis.createClient();
	
	cpu.on('message', function(data) {
		pubServer.publish("channelLog", JSON.stringify({ id: 'cpu', message: data }) );
	});
	
	var cpuLength = os.cpus().length;
	
	for (var i = 0; i < cpuLength; i++) {
		var worker = cluster.fork();
		console.log('worker started... PID: %s', worker.process.pid);
	}
	
	cluster.on('death', function(worker) {
		console.log('worker %s died. restart...', worker.pid);
		cluster.fork();
	});
	
} else {

	var app = express();
	var root = __dirname;

	var db = redis.createClient();
	
	var redisPub = redis.createClient();
	var redisSub = redis.createClient();
	var redisClient = redis.createClient();
	
	app.configure(function() {
	    app.set('port', process.env.PORT || 3000);
	    app.set('views', root + '/views');
	    app.set('view engine', 'jade');
	    app.use(express.favicon());
	    //app.use(express.logger('dev'));
	    app.use(express.bodyParser());
	    app.use(express.cookieParser());
	    app.use(express.cookieSession({
	        secret: 'j089asjd09a8sjd98asjd908sjad7h8q7e7qwe97agdasidh3',
	        cookie: {
	            maxAge: 60 * 60 * 1000
	        }
	    }));
	    app.use(express.methodOverride());
	    app.use(express.static(path.join(root, 'public')));
	    app.use(app.router);
	    app.use(routes.error404);
	});
	
	app.configure('development', function() {
	    app.use(express.errorHandler());
	});
	
	app.get('/', routes.index);
	app.get('/users', user.list);
	
	var server = http.createServer(app).listen(app.get('port'), function() {
	    console.log("Express server listening on port " + app.get('port'));
	});
	
	var io = socketio.listen(server);
	
	io.enable('browser client minification');
	io.enable('browser client etag');
	io.enable('browser client gzip');
	
	io.set('log level', 0);
	io.set('store', new redisStore({
		redisPub: redisPub,
		redisSub: redisSub,
		redisClient : redisClient
	}));
	
	io.sockets.on('connection', function (socket) {
		
		var channelLogClient = redis.createClient();
		
		channelLogClient.subscribe("channelLog");
		channelLogClient.on("message", function(channel, message) {
			socket.emit('log', message );
		});
		
		socket.on("disconnect", function() {
			channelLogClient.unsubscribe("channelLog");
			channelLogClient.quit();
			delete channelLogClient;
		});
	});
}