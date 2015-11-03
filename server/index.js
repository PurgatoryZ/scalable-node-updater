
var http = require('http');
var sockjs = require('sockjs');
var redis = require('redis');
var os = require('os');
var schema = require('./event-schema');
//var splunk = require('splunk-sdk');


var host = os.hostname();
// Setup Redis pub/sub.
// NOTE: You must create two Redis clients, as
// the one that subscribes can't also publish.

var pub = redis.createClient(6379, 'redis');
var sub = redis.createClient(6379, 'redis');
sub.subscribe('global');

// Listen for messages being published to this server.
sub.on('message', function(channel, msg) {
    // Broadcast the message to all connected clients on this server.
    console.log(host, ' got update: ', msg);
    for (var i=0; i<clients.length; i++) {
        clients[i].write(msg);
    }
});

// Setup our SockJS server.
var clients = [];
var echo = sockjs.createServer();
echo.on('connection', function(conn) {
    // Add this client to the client list.
    clients.push(conn);

    // Listen for data coming from clients.
    conn.on('data', function(message) {
        // Publish this message to the Redis pub/sub.
        pub.publish('global', message);
    });

    // Remove the client from the list.
    conn.on('close', function() {
        clients.splice(clients.indexOf(conn), 1);
    });
});

function handleRequest(request, response){
    if (request.method === 'POST') {
        if (request.url === '/update') {
            var message = '';
            request.on('data', function(data) {
                message += data;
            });
            request.on('end', function() {
                if (schema.check(message)) {
                    pub.publish('global', message); //this will send the message to all nodes, including ourself
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(message)); //send the update back to the person who sent it.
                } else {
                    response.end('Message type not supported.');
                }
            });
        } else {
            response.end('Unknown POST: ' +  request.url);
        }
    } else {
        //These are just dummy values to test if the load balancer is working correctly with different routes
        if (request.url === '/otherinfo') {
            response.end('You asked for other info!');
        } else {
            response.end('It Works!! Path Hit: ' + request.url);
        }

    }
}

// Begin listening.
var server = http.createServer(handleRequest);
echo.installHandlers(server, {prefix: '/realtimeupdates'});
console.log(host, ' listening on 8181');
server.listen(8181);
