/*
 * GET home page.
 */
exports.index = function(req, res) {
	res.render('index', {
		title: 'Server Monitor Status',
		ip: req.ip,
		baseUrl: req.headers.host,
		views: req.session.views
	});
};

exports.error404 = function(req, res) {
	res.status(404);
	res.render('404', {
		title: 'Not Found',
		ip: req.ip,
		baseUrl: req.headers.host,
		url: req.headers.host + req.url
	});
};
