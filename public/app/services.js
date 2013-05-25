(function( doc, ng, app ) {

	"use strict";

	/* Services */
	var services = ng.module('myApp.services', []);
	
	services.value('version', '1.1');
	
	services.factory('socket', function($rootScope) {
		var socket = io.connect();
		
		return {
			on: function(eventName, callback) {
				socket.on(eventName, function() {  
					var args = arguments;
					$rootScope.$apply(function() {
						callback.apply(socket, args);
					});
				});
			},
			emit: function(eventName, data, callback) {
				socket.emit(eventName, data, function() {
					var args = arguments;
					$rootScope.$apply(function() {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			}
		};
	});
	
})( document, angular, myApp );