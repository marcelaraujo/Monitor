(function( ng, app ) {

	"use strict";

	/* Filters */
	var filters = ng.module('myApp.filters', []);

	filters.filter('interpolate', ['version', function(version) {
		return function(text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	}]);

})( angular, myApp );