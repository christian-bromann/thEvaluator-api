// define vars
var application_root = __dirname,

    // require node modules
    express    = require("express"),
    path       = require('path'),
    http       = require('http'),
    mongoose   = require('mongoose'),

    // require models and utils
    generateID = require('./utils/generateID'),
    TestCase   = require('./models/TestCase').model,

    // create express and server instance
    app      = express(),
    server   = http.createServer(app),

    // create io instance
    ioModule = require('socket.io'),
    io       = ioModule.listen(server, { log: false });

// connect to mongodb
mongoose.connect('mongodb://localhost/thEvaluator');

// configure express
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.cookieParser('thEvaluator'));
    app.use(express.methodOverride());
    app.use(express.session({secret:'thEvaluator'}));
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('views', path.join(application_root, "views"));
});

// save test case
app.post('/createTestcase',function(req,res) {
    var id = utils.generateID(),
        newTestCase = new TestCase({
            id: id,
            name: req.body.name,
            url: req.body.url,
            finishElem: req.body.finishElem,
            finishAction: req.body.finishAction
        });

    newTestCase.save();

    console.log('TestCase %s saved!',id);
    res.send(id);
});

// save test case
app.get('/watch/:id',function(req,res) {
    TestCase.find({'id':req.params.id},function(err,testCase) {
        res.set('Content-Type', 'text/html');
        res.send(testCase);
    });
});

// store mouse position
io.sockets.on('connection', function(socket) {

    socket.on('startTestCase', function (id, fn) {
        TestCase.findOne( { 'id' : id } , function(err,testCase) {
            fn(testCase);
        });
    });

    socket.on('mousePosition', function(data) {
        // console.log(socket.id);
        TestCase.findOne({'id':data.id},function(err,testCase) {
            testCase.mousePositions.push({ x: data.x, y: data.y });
            testCase.save();
        });
        console.log('new mouse position for test case %s: [x:%s,y:%s]', data.id, data.x, data.y);
    });
});

// start server to listen on port 80
server.listen(80);
console.log('### app is listen on http://localhost:80 ###');