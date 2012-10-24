/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view options', {
        pretty: true
    });
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.cookieSession({
        secret: 'asd98ua0sdu0as9ud0a8sd87h2378hd283h8ash9das',
        cookie: {
            maxAge: 60 * 60 * 1000
        }
    }));
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});