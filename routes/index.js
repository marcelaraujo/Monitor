/*
 * GET home page.
 */
exports.indexBlock = function(req, res) {
    res.render('blocks/index', {
        title: 'Home',
        ip: req.ip,
        baseUrl: req.headers.host
    });
};

/*
 * GET partials pages
 */
exports.partials = function (req, res) {
	var name = req.params.name;
	res.render('partials/' + name, {
        title: 'Log',
        ip: req.ip,
        baseUrl: req.headers.host
    });
};

/*
 * GET 404 page.
 */
exports.error404 = function(req, res) {
    res.status(404);
    res.render('blocks/404', {
        title: 'Not Found',
        ip: req.ip,
        baseUrl: req.headers.host,
        url: req.headers.host + req.url
    });
};
