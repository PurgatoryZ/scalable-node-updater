var SockJS = require('sockjs-client');

var spinUpClient = function() {
    var sock = new SockJS('http://192.168.99.100:8282/realtimeupdates');
    console.log(sock);
    sock.onopen = function () {
        console.log('open');
        //sock.send('test');
    };
    sock.onmessage = function (e) {
        console.log('message', e.data);
    };
    sock.onclose = function () {
        console.log('close');
        process.exit(-1);
    };
};

spinUpClient();
spinUpClient();

setTimeout(function() {
    console.log('closing from timeout');
    process.exit(-1);
},100000);
