Ext.require(['Ext.data.*', 'Ext.chart.*', 'Ext.util.*']);

Ext.onReady(function () {

	var socket = io.connect( baseUrl );

	var storeCpu = Ext.create('Ext.data.ArrayStore', {
        fields: [ 'user', 'nice', 'sys', 'idle', 'irq', 'name' ],
		autoLoad: false,
		data: [
			
		]
    });
    
    var container = Ext.create('Ext.container.Container', {
        layout: 'fit',
        renderTo: Ext.get('graph-cpu'),
        border: 0,
        style: {
        	padding: '5px'
        },
        items: [{
        	xtype: 'chart',
			height: 270,
			style: 'background:#fff',
			animate: true,
			shadow: true,
			store: storeCpu,
			legend: {
				position: 'right'
			},
			axes: [{
				type: 'Numeric',
				position: 'left',
				fields: ['user', 'sys', 'idle', 'nice', 'irq'],
				minimum: 0,
				maximum: 100,
				label: {
					renderer: Ext.util.Format.numberRenderer('0,0')
				},
				grid: true,
				title: 'Processor Usage'
			}, {
				type: 'Category',
				position: 'bottom',
				fields: ['name'],
				title: 'Processor',
				label: {
		        	rotate: {
		        		degrees: 315
					}
				}
			}],
			series: [{
				type: 'column',
				axis: 'left',
				xField: 'name',
				yField: ['user', 'sys', 'idle', 'nice', 'irq']
			}],
        }]
    });
    
    socket.on('log', function(data) {
    	var data = Ext.decode(data);
    	if( data.id == 'cpu' ) {
    		try {
    			storeCpu.loadData( data.message );
    		} catch(err) {
    			console.log('Erro');
    		}
    	}
	});
	
	socket.on('disconnect', function() {
		$.msgGrowl({
			type: 'info',
			title: 'Header',
			text: 'Lorem ipsum dolor sit amet, consectetur ipsum dolor sit amet, consectetur.'
		});
		socket.disconnect();
	});
});