/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');

var app = express();

var root = __dirname;

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', root + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
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
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});