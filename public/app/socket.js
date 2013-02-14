!function($) {

    $(function() {

        "use strict";

        /*
        var chartCpu=new Highcharts.Chart({chart:{renderTo:"graph-cpu",type:"column",height:250},title:{text:null},xAxis:{categories:[],labels:{rotation:-45,align:"right",style:{fontSize:"13px",fontFamily:"Verdana, sans-serif"}}},yAxis:{min:0,max:100,title:{text:"Processor Core Usage (%)"}},legend:{enabled:!1},tooltip:{formatter:function(){return"<b>"+this.x+"</b><br/>CPU Use "+Highcharts.numberFormat(this.y,2)+" %"}},series:[{name:"cpu",data:[]}]});

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
            var data = $.parseJSON(data);
            if( data.message != undefined ) {
                data = data.message;
                var categories = [];
                var values = [];
                $.each(data, function() {
                    categories.push( this.name );
                    values.push( parseFloat( this.total ) );
                });

                chartCpu.xAxis[0].setCategories(categories);
                chartCpu.series[0].setData(values);
            }
        });

        socket.on('log-data', function(data) {
            var data = $.parseJSON(data);
            if( data.message != undefined ) {
                console.log( data.message );
            }
        });
        */
    });

}(window.jQuery);
