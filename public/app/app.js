(function( ng, hc, win ) {

	"use strict";

	// Declare app level module which depends on filters, and services
	var myApp = ng.module('myApp', ['ngResource', 'myApp.controllers', 'myApp.filters', 'myApp.services', 'myApp.directives']);
	
	myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
			
		$routeProvider.when('/', {
			controller: 'IndexController',
			templateUrl: 'partials/index'
		});
			
		$routeProvider.when('/logs', {
			controller: 'LogsController',
			templateUrl: 'partials/logs'
		});
		
		$routeProvider.otherwise({
			redirectTo: '/'
		});
			
		$locationProvider.html5Mode(true);
	}]);
	
	myApp.run(function($rootScope, $window, $log) {
		$log.log('Application running...');
		
		hc.setOptions({
			global: {
				useUTC: false
			}
		});
	});
	
	win.myApp = myApp;
	
})( angular, Highcharts, window );