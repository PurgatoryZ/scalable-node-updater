var SockJS = require('sockjs-client');

var count = 0;
var clientDestinations = {
    type: 'REGISTER_DESTINATIONS',
    destination: ['my_cust_id' + count,  //Specific to the custId. E.g. order updates, hours, menu item updates, etc.
        'global', //all global settings we care about. E.g. polling/retry interval, global messages, etc
        'my_logged_in_user', //messages specific to this user. E.g. user preferences, etc.
    ]
};

var spinUpClient = function() {
    //var sock = new SockJS('http://192.168.99.100:8282/realtimeupdates');
    var sock = new SockJS('http://localhost:8181/realtimeupdates');
    //console.log(sock);
    sock.onopen = function () {
        console.log('open', count++);
        sock.send(JSON.stringify(clientDestinations));
    };
    sock.onmessage = function (e) {
        console.log('message', e.data);
    };
    sock.onclose = function () {
        console.log('close');
        process.exit(-1);
    };
};

var num = 0;
var interval = setInterval(function() {
    num += 1;
    if (num > 100) {
        clearInterval(interval);
        return;
    }
    console.log(num);
    spinUpClient();
}, 10);

setTimeout(function() {
    console.log('closing from timeout');
    process.exit(-1);
},100000);
