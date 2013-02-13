/**
 * Module dependencies.
 */
var express = require('express'),
    //RedisStore = require('connect-redis')(express),
	//MongoStore = require('connect-mongo')(express),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    os = require("os"),
    redis = require('redis'),
	cluster = require("cluster"),
	socketio = require('socket.io'),
	redisStore = require('socket.io/lib/stores/redis'),
	cpu = require('./plugins/cpu.js');

/**
 * Application
 */
if (cluster.isMaster) {

	var cpuLength = os.cpus().length;
	var cpuPublisher = redis.createClient();

	for (var i = 0; i < cpuLength; i++) {
		var worker = cluster.fork();
		console.log('worker started... PID: %s', worker.process.pid);
	}

	cluster.on('death', function(worker) {
		console.log('worker %s died. restart...', worker.pid);
		cluster.fork();
	});

	cpu.start();
	cpu.on('message', function(data) {
		cpuPublisher.publish("cpu-data", JSON.stringify({ message: data }) );
	});

} else {

	var app = express();
	var root = __dirname;
	var secret = 'as9d87as89dh9ash9d98h298dh932hx932pklpa';

	app.configure(function() {
	    app.set('port', process.env.PORT || 3000);
	    app.set('views', root + '/views');
	    app.set('view engine', 'jade');
	    app.use(express.favicon());
	    //app.use(express.logger( 'default' ));
	    app.use(express.bodyParser());
	    app.use(express.compress());
	    /*
	    app.use(express.cookieParser(secret));
	    app.use(express.cookieSession({
	        key: 'monitor-app',
	        secret: secret,
	        cookie: {
	            maxAge: 60 * 60 * 1000
	        }
	    }));
	    app.use(express.session({
	    	secret: secret,
	        store: new MongoStore({
	          db: 'express'
	        })
	    }));
	    app.use(express.session({
	    	store: new RedisStore({
	    		host: '127.0.0.1',
	    		port: '6379',
	    		prefix: 'session:redis:'
	    	})
	    }));
	    */
	    app.use(function(req, res, next) {
	    	res.setHeader('X-Powered-By', 'MonitorApp');
	    	next();
	    });
	    app.use(express.methodOverride());
	    app.use(express.static(path.join(root, 'public')));
	    app.use(app.router);
	    app.use(routes.error404);
	});

	app.configure('development', function() {
	    app.use(express.errorHandler());
	});

	app.get('/', routes.index);

	var port = app.get('port');
	var server = http.createServer(app).listen(port, function() {
	    console.log("Express server listening on port " + port);
	});

	var db = redis.createClient();

	var redisPub = redis.createClient();
	var redisSub = redis.createClient();
	var redisClient = redis.createClient();

	var io = socketio.listen(server);

	io.configure(function() {

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

			var cpuSubscriber = redis.createClient();

			cpuSubscriber.subscribe("cpu-data");
			cpuSubscriber.on("message", function(channel, message) {
				socket.emit('cpu-data', message );
			});

			socket.on("disconnect", function() {
				cpuSubscriber.unsubscribe("cpu-data");
				cpuSubscriber.quit();
				delete cpuSubscriber;
			});
		});

		/**
		 *Socket.IO Authorization
		 */
		io.set('authorization', function(handshakeData, callback) {
			if (handshakeData.xdomain) {
	            callback('Cross-domain connections are not allowed', false);
	        } else {
	            callback(null, true);
	        }
		});
	});

}
