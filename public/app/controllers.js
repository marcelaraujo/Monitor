(function( ng, app ) {

	"use strict";

		/* Controllers */
		var controllers = {};
		
		/* Controllers */

		controllers.ApplicationController = function ApplicationController($scope, $log, socket) {
			$log.log('ApplicationController');
			socket.on('log', function (data) {
				$scope.name = data.name;
			});
		}
		
		controllers.IndexController = function IndexController($scope, $log, socket) {
			$log.log('IndexController');
			socket.on('send:name', function (data) {
				$scope.name = data.name;
			});
		}
		
		controllers.LogsController = function LogsController($scope, $log, socket) {
			$log.log('LogsController');
			socket.on('send:time', function (data) {
				$scope.time = data.time;
			});
		}
		
		controllers.ApplicationController.$inject = ['$scope', '$log', 'socket'];
		controllers.LogsController.$inject = ['$scope', '$log', 'socket'];
	
		ng.module('myApp.controllers', []).controller(controllers);

})( angular, myApp );





