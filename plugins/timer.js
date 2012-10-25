/**
 * setTimeout(this, time, this.function, [param1, param2, etc]) 
 */
module.exports.setMyTimeout = function(o, t, f, a) {
	return setTimeout(function() {
		f.apply(o,a);
	}, t);
};

module.exports.setMyInterval = function (o, t, f, a) {
	return setInterval(function() {
		f.apply(o,a);
	}, t);
};