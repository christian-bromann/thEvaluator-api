/* jshint -W024 */
/* jshint expr:true */

// require models and node modules
var express    = require("express"),
    path       = require('path'),
    http       = require('http'),
    mongoose   = require('mongoose'),
    socketio   = require('socket.io'),
    Routes     = require('./routes'),
    config     = require('./config.json'),
    env        = process.argv.splice(2,1);
    registerSockets = require('./io/index');

var API = module.exports = function(options) {

    'use strict';

    this.options = options;

    // create express and server instance
    this.express = express();
    this.server  = http.createServer(this.express);
    // create io instance
    this.io      = socketio.listen(this.server, { log: this.options.showLogs });
    this.io.sockets.on('connection', registerSockets);

};

/**
 * setup express and mongo
 */
API.prototype.setup = function() {

    // connect to mongodb
    var uri = 'mongodb://user:pass@host:port/database'.replace(/[a-z]+/g,function(all) { return this[all] || all; }.bind(this.options.db));
    mongoose.connect(uri, this.options.db);

    // configure express
    this.express.configure(function(){
        this.express.use(express.bodyParser());
        this.express.use(express.cookieParser(this.options.secret));
        this.express.use(express.methodOverride());
        this.express.use(express.session({secret:this.options.secret}));
        this.express.use(this.express.router);
        this.express.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    }.bind(this));

    this.routes = new Routes(this.express);

};

/**
 * starts express server
 */
API.prototype.start = function() {

    this.setup();

    console.log('### app is listen on http://localhost:%s ###',this.options.port);
    this.server.listen(this.options.port);

};

// execute start script only if this file was executed
if(__filename === process.argv[1]) {

    // check if enviroment is given
    if(env.length !== 1) {
        console.error('[ERROR] can\'t start thEvaluator API as service!\n');
        console.info('enviroment argument is missing');
        process.exit(1);
    }

    // check if enviroment exists in config file
    if(config.enviroments[env[0]] === undefined) {
        console.error('[ERROR] can\'t start thEvaluator API as service!\n');
        console.info('given enviroment (%s) is unknown in config.js',env[0]);
        process.exit(1);
    } else {
        env = env[0];
    }

    var app = new API(config.enviroments[env]).start();
}