Ext.require(['Ext.data.*', 'Ext.chart.*', 'Ext.util.*']);

Ext.onReady(function () {

	var generateData = function(n, floor){
        var data = [],
            p = (Math.random() *  11) + 1,
            i;
            
        floor = (!floor && floor !== 0)? 20 : floor;
        
        for (i = 0; i < (n || 12); i++) {
            data.push({
                name: Ext.Date.monthNames[i % 12],
                data1: Math.floor(Math.max((Math.random() * 100), floor)),
                data2: Math.floor(Math.max((Math.random() * 100), floor)),
                data3: Math.floor(Math.max((Math.random() * 100), floor)),
                data4: Math.floor(Math.max((Math.random() * 100), floor)),
                data5: Math.floor(Math.max((Math.random() * 100), floor)),
                data6: Math.floor(Math.max((Math.random() * 100), floor)),
                data7: Math.floor(Math.max((Math.random() * 100), floor)),
                data8: Math.floor(Math.max((Math.random() * 100), floor)),
                data9: Math.floor(Math.max((Math.random() * 100), floor))
            });
        }
        return data;
    };

	var store1 = Ext.create('Ext.data.JsonStore', {
        fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data9', 'data9'],
        data: generateData()
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
	        style: 'background:#fff',
	        height: 270,
	        animate: true,
	        shadow: true,
	        store: store1,
	        axes: [{
	            type: 'Numeric',
	            position: 'left',
	            fields: ['data1'],
	            label: {
	                renderer: Ext.util.Format.numberRenderer('0,0')
	            },
	            title: 'Number of Hits',
	            grid: true,
	            minimum: 0
	        }, {
	            type: 'Category',
	            position: 'bottom',
	            fields: ['name'],
	            title: 'Month of the Year'
	        }],
	        series: [{
	            type: 'column',
	            axis: 'left',
	            highlight: true,
	            /*
	            tips: {
	                trackMouse: true,
	                width: 140,
	                height: 28,
	                renderer: function (storeItem, item) {
	                    this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data1') + ' $');
	                }
	            },
	            */
	            label: {
	                display: 'insideEnd',
	                'text-anchor': 'middle',
	                field: 'data1',
	                renderer: Ext.util.Format.numberRenderer('0'),
	                orientation: 'vertical',
	                color: '#333'
	            },
	            xField: 'name',
	            yField: 'data1'
	        }]
        }]
    });
});