!function($) {

	$(function() {
	
		"use strict";
		
    	var socket = io.connect( baseUrl );
    	
    	socket.on('error', function(reason) {
	    	console.error('Unable to connect Socket.IO', reason);
	    });
    	
    	socket.on('disconnect', function() {
			console.info('disconnected');
			socket.disconnect();
		});
	    
	    socket.on('connect', function() {
	    	console.info('successfully established a working connection \o/');
	    });
	    
	    socket.on('connecting', function() {
	    	console.info('connecting');
	    });
	    
	    socket.on('connect_failed', function() {
	    	console.info('no more transports to fallback to');
	    });
	    
	    socket.on('reconnect', function() {
	    	console.info('reconnect');
	    });
	    
	    socket.on('reconnecting', function() {
	    	console.info('reconnecting');
	    });
	    
	    socket.on('cpu-data', function(data) {
		});
    });

}(window.jQuery);