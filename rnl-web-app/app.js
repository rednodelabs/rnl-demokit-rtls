var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const log = require('log-to-file');
const yargs = require('yargs');

const argv = yargs
    .option('log', {
        alias: 'l',
        description: 'Activates Logging',
        type: 'boolean',
    })
	.option('log_simple', {
        alias: 's',
        description: 'Activates Minified Logging',
        type: 'boolean',
    })
    .help()
    .alias('help', 'h')
    .argv;

let logging = 0;
let logging_simplified = 0;

const logDate  = new Date();
const logDateString = logDate.getFullYear() + "-" 
	+ (logDate.getMonth() + 1) + "-" + logDate.getDate() + "_" 
	+ logDate.getHours() + "h-" + logDate.getMinutes()+"m";

if (argv.log) {
    logging = 1;
}
if (argv.log_simple) {
	logging_simplified = 1;
}


app.get('/', function(req, res){
    res.sendFile(__dirname + '/webpage/index.html');
});

app.use(express.static('webpage'))

function time(s) {
    const myDate = new Date();
    return myDate.toUTCString()+": ";
}

const client_types = {
    WEB: 'web',
    HOST: 'host',
}

var host_connected = 0;

io.on('connection', function(socket){
    var client_type;

    socket.on('disconnect', function () {
        console.log(time());
        switch(client_type)
        {
            case client_types.WEB:
                console.log('web disconnected');
                break;
			default:
                socket.broadcast.emit('host_disconnected');
                console.log('host disconnected');
                host_connected = 0;
                break;
        }
    });

    socket.on('client_type', function (msg) {
        client_type = msg.client_type;
        console.log(time());
        console.log(msg);
        switch(client_type)
        {
            case client_types.HOST:
                host_connected = 1;
				console.log('host connected');
				socket.broadcast.emit('host_connected');
                break;
            case client_types.WEB:
				console.log('web connected');
                if(host_connected)
                {
                    socket.emit('host_connected');
                }
                break;
        }
    });

    socket.on('net_stats', function (msg) {
        socket.broadcast.emit('net_stats', msg);
        if(logging)
        {
            log(JSON.stringify(msg), 'log_full_' + logDateString + '.log');
        }
		
		if(logging_simplified)
		{
			if(msg.type == "dist" || msg.type == "coordinates")
			{
				
				if(msg.type == "dist")
				{
					var msg_simple =  
					{
						type: "ranging",
						distances: new Array(msg.rnr.length)
					};
					
					for(let i = 0; i<msg.rnr.length; i++)
					{
						msg_simple.distances[i] = new Array(3).fill(0);
						
						msg_simple.distances[i][0] = msg.rnr[i][0];
						msg_simple.distances[i][1] = msg.rnr[i][1];
						msg_simple.distances[i][2] = msg.rnr[i][2];
					}
					
					log(JSON.stringify(msg_simple), 'log_min_' + logDateString + '.log');
				}
				
				if(msg.type == "coordinates" && msg.active_node_count > 0)
				{
					var msg_simple =  
					{
						type: "coordinates",
						active_anchors: msg.active_node_count,
						active_tags: msg.active_node_count_tag,
						filter_strength: msg.tag_filter_order
					};
					
					msg_simple.active_anchors_coordinates = new Array(msg.active_node_count).fill(0);
					
					for(let i = 0; i<msg.active_node_count; i++)
					{
						msg_simple.active_anchors_coordinates[i] = [msg.active_node_index[i], msg.positions[i]];
					}
					
					if(msg.active_node_count_tag > 0)
					{
						msg_simple.active_tags_coordinates = new Array(msg.active_node_count_tag).fill(0);
						
						for(let i = 0; i<msg.active_node_count_tag; i++)
						{
							msg_simple.active_tags_coordinates[i] = [msg.active_node_index_tag, msg.tag_position[msg.active_node_index_tag[i]]];
						}
					}
					
					log(JSON.stringify(msg_simple), 'log_min_' + logDateString + '.log');
				}
			}
		}
    });
	
	socket.on('commands', function (msg) {
        socket.broadcast.emit('commands', msg);
        console.log(time());
        console.log(msg);
    });

});

http.listen(3000, function(){
    console.log(time() + 'listening on *:3000');
});
