/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    os = require("os"),
    redis = require('redis'),
    cluster = require("cluster"),
    socketio = require('socket.io'),
    redisStore = require('socket.io/lib/stores/redis'),
    cpu = require('./plugins/cpu.js'),
    Tail = require("tailnative");

/**
 * Application
 */
if (cluster.isMaster) {

    var cpuLength = os.cpus().length;
    var publisherData = redis.createClient();

    for (var i = 0; i < cpuLength; i++) {
        var worker = cluster.fork();
        console.log('worker started... PID: %s', worker.process.pid);
    }

    cluster.on('death', function(worker) {
        console.log('worker %s died. restart...', worker.pid);
        cluster.fork();
    });

	/**
	 * CPU stats monitor
	 */
    cpu.start();
    cpu.on('message', function(data) {
        publisherData.publish("cpu-data", JSON.stringify({ message: data }) );
    });
    
    /**
     * Log file monitor
     */
    var tail = new Tail("/var/log/httpd/marcel.dev.com-access_log");
	tail.on('data', function(data) {
    	publisherData.publish("log", data);
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
        app.use(express.bodyParser());
        app.use(express.compress());
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

    app.get('/', routes.indexBlock);
    //app.get('*', routes.indexBlock);
    app.get('/partials/:name', routes.partials);
    

    var port = app.get('port');
    var server = http.createServer(app).listen(port, function() {
        console.log("Express server listening on port " + port);
    });

    var io = socketio.listen(server);

    io.configure(function() {
    
	    var redisPub = redis.createClient();
	    var redisSub = redis.createClient();
	    var redisClient = redis.createClient();

        io.enable('browser client minification');
        io.enable('browser client etag');
        io.enable('browser client gzip');

        io.set('log level', 0);
        io.set('store', new redisStore({
            redisPub: redisPub,
            redisSub: redisSub,
            redisClient: redisClient
        }));

        io.sockets.on('connection', function(socket) {

            var subscriber = redis.createClient();
            subscriber.subscribe("cpu-data");
            subscriber.on("message", function(channel, message) {
                socket.emit('cpu-data', message );
            });
            
            var log = redis.createClient();
            log.subscribe("log");
            log.on("message", function(channel, message) {
            	socket.emit('log', message );
            });

            socket.on("disconnect", function() {
                subscriber.unsubscribe("cpu-data");
                subscriber.quit();
                delete subscriber;
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
