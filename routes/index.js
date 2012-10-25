/*
 * GET home page.
 */
exports.index = function(req, res) {
	res.render('index', {
		title: 'Express',
		ip: req.ip,
		baseUrl: req.headers.host
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