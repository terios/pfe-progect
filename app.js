/**
 * Created by root on 10/05/14.
 */

var express = require('express'),
    app = express(),
    http = require('http'),
    mongoose = require('mongoose'),
    config = require('./env/config.json');

//setting mongodb url and connecting
var mongo_uri = config.MONGO_URI;
var mongo_db = config.MONGO_DB;
var db = mongoose.connect('mongodb://' + mongo_uri + '/' + mongo_db);

//bodyparser to fetch params from requests
var bodyParser = require('body-parser');
app.use(bodyParser());

//serve angularJS file from /app
app.use(express.static('./app'));

// Bootstrap models
require('./models/Users');


//services route
require('./routes/adaptation')(app);

//create http server liston on 3000
var httpServer = http.createServer(app);

var io = require('socket.io').listen(httpServer);

httpServer.listen(3000);

//webSocket event configuration
io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world',
        onlineState: true });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

console.log('Express http server started on port 3000   ');

module.exports = app;