(function( ng, app ) {

	"use strict";

	/* Directives */
	ng.module('myApp.directives', [], function($compileProvider) {
	
		$compileProvider.directive('appVersion', ['version', function (version) {
			return function(scope, elm, attrs) {
				elm.text(version);
			};
		}]);
		
		$compileProvider.directive('appChart', function($log) {
			return {
				restrict: 'A',
				//scope: {
				//	id: '@id'
				//},
				//replace: true,
				//controller: function($scope, $element, $attrs) {
				//},
				//template: '<div id="test">Not working!</div>',
				link: function(scope, element, attrs) {
				
					var data = [];
					var time = (new Date()).getTime();
					
					for (var i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    
                    $log.log(data);
					
					var categories = ['Apples', 'Bananas', 'Oranges'];
					
					/*
					var chart = $('#graph-cpu').highcharts({
						chart: {
							type: 'bar',
							animation: Highcharts.svg,
							events: {
								load: function() {
									$log.log('load');
								}
							}
						},
						title: {
							text: 'Poll Name Here',
							style:{
								color: '#3E576F',
								fontSize: '23px',
								fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif'
							}
						},
						xAxis: {
							categories: categories,
							labels: {
								style: {
									fontSize: '16px',
									fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
									color: 'black'
								}
							}
						},
						yAxis: {
							title: {
								text: 'Votes',
								style: {
									fontSize: '14px',
									fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
									color: 'black',
									fontWeight: 'normal'
								}
							}
						},
						legend: {
							enabled: false
						},
						tooltip:{
							enabled: false
						},
						series: [{
							name: 'Vote Count',
							data: data,
							dataLabels: {
								enabled: true,
							}
						}],
						exporting: {
							enabled: false
						}
					});
					*/
					
					$log.log($('#graph-cpu'));
				}
			};
		});
	});

})( angular, myApp );