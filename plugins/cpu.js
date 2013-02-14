var os = require('os'),
    util = require('util'),
    events = require('events'),
    timer = require('./timer');

var Cpu = function( interval ) {
    events.EventEmitter.call(this);

    var me = this;
    var cores = [];

    var parseDouble = function parseDouble(value) {
        if(typeof value == "string") {
            value = value.match(/^-?\d*/)[0];
        }
        return !isNaN(parseInt(value)) ? value * 1 : 0;
    };

    var log = function(cores) {

        var cpus = os.cpus(), dataLast = [], coreMain = [], coreTotal = 0;

        for(i in cpus) {

            var cpu = cpus[i].times, core = [], total = 0;

            for(p in cpu) {
                total += cpu[p];
                core[p] = cpu[p];
                coreMain[p] = ( (coreMain[p] == undefined ) ? 0 : coreMain[p]) + cpu[p];
            }

            core['name'] = 'Core ' + i;
            core['total'] =  total;

            coreTotal += total;

            dataLast.push( core );
        }

        coreMain['name'] =  'Total';
        coreMain['total'] = coreTotal;

        dataLast.push( coreMain );
        cores.push( dataLast );

        if( cores.length > 1 ) {
            var dataPrevious = cores.shift();

            var out = [];

            for(var i = 0, l = dataPrevious.length; i < l; i++) {

                var p = { 'total' : 0 }, totalDiff = dataLast[i]['total'] - dataPrevious[i]['total'];

                for(var cpu in dataLast[i]) {
                    if( typeof( dataLast[i][cpu] ) == 'number' && ( 'total' != cpu && 'idle' != cpu ) ) {
                        p['total'] += parseDouble( ( (1000 * ( dataLast[i][cpu] - dataPrevious[i][cpu] ) / totalDiff ) / 10) );
                    } else if( 'name' == cpu) {
                        p['name'] = dataLast[i]['name'];
                    }
                }

                p['total'] = p['total'].toFixed(2);

                out.push( p );
            }

            me.emit("message", out);

            delete dataPrevious;
        }
    };

    this.start = function start() {
        timer.setMyInterval(me, 1000, log, [cores]);
    };
};

util.inherits(Cpu, events.EventEmitter);
module.exports = new Cpu();
