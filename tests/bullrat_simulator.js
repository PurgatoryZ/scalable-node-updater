var http = require('http');
var _ = require('lodash');

var options = {
    hostname: '192.168.99.100',
    port: 8282,
    path: '/update',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
        //'Content-Length': postData.length
    }
};

for (var i = 0; i < 1; i++) {

    var data = {
        type: 'order update',
        destination: _.random(1,10),
        data: {
            custId: _.random(1,10),
            orderId: i
        }
    };

    var req = http.request(options, function(res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
        });
        res.on('end', function() {
            //console.log('No more data in response.')
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(JSON.stringify(data));
    req.end();
}


