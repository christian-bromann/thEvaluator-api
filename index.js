/* jshint -W024 */
/* jshint expr:true */

// require models and node modules
var express    = require("express"),
    path       = require('path'),
    http       = require('http'),
    mongoose   = require('mongoose'),
    socketio   = require('socket.io');

var API = module.exports = function(options) {

    'use strict';

    // create express and server instance
    this.express = express();
    this.server  = http.createServer(this.express);
    // create io instance
    this.io      = socketio.listen(this.server, { log: false });

};

/**
 * setup express and mongo
 */
API.prototype.setup = function() {

    // connect to mongodb
    mongoose.connect('mongodb://localhost/thEvaluator');

    // configure express
    this.express.configure(function(){
        this.express.use(express.bodyParser());
        this.express.use(express.cookieParser('thEvaluator'));
        this.express.use(express.methodOverride());
        this.express.use(express.session({secret:'thEvaluator'}));
        this.express.use(this.express.router);
        this.express.use(express.static(path.join(__dirname, "public")));
        this.express.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        this.express.set('views', path.join(__dirname, "views"));
    }.bind(this));

};

/**
 * starts express server
 */
API.prototype.start = function() {

    this.setup();

    console.log('### app is listen on http://localhost:80 ###');
    this.server.listen(9001);

};

// execute start script only if this file was executed
if(__filename === process.argv[1]) {
    var app = new API().start();
}