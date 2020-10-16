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
    .help()
    .alias('help', 'h')
    .argv;

var logging = 0
if (argv.log) {
    logging = 1;
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

const command_types = {
    WHO_AM_I: 'who_am_i',
    START: 'start',
    STOP: 'stop',
}

var host_connected = 0;
var host_started = 0;

io.on('connection', function(socket){
    var client_type;

    socket.on('disconnect', function () {
        console.log(time());
        switch(client_type)
        {
            case client_types.HOST:
                socket.broadcast.emit('host_disconnected');
                console.log('host_disconnected');
                host_connected = 0;
                break;
            case client_types.WEB:
                console.log('web_disconnected');
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
                host_started = 0;
                socket.broadcast.emit('host_connected');
                var stop_msg = {
		            command_type: command_types.STOP
	            };
	            socket.emit('commands',stop_msg);
                console.log(stop_msg);
                break;
            case client_types.WEB:
                if(host_connected&&!host_started)
                {
                    socket.emit('host_connected');
                }
                else if(host_connected&&host_started)
                {
                    socket.emit('host_started');
                }
                break;
        }
    });

    socket.on('commands', function (msg) {
        socket.broadcast.emit('commands', msg);
        command_type = msg.command_type;
        switch(command_type)
        {
            case command_types.START:
                host_started = 1;
                break;
            case command_types.STOP:
                host_started = 0;
                break;
        }
        console.log(time());
        console.log(msg);
    });

    socket.on('net_stats', function (msg) {
        socket.broadcast.emit('net_stats', msg);
        if(logging)
        {
            log(JSON.stringify(msg), 'default.log');
        }
    });

});

http.listen(3000, function(){
    console.log(time() + 'listening on *:3000');
});
