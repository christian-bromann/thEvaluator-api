// define vars
var application_root = __dirname,

    // require models and node modules
    express    = require("express"),
    path       = require('path'),
    http       = require('http'),
    mongoose   = require('mongoose'),

    TestCase   = require('./models/TestCase').model,
    generateID = require('./utils/generateID'),

    // create express and server instance
    app        = express(),
    server     = http.createServer(app),

    // create io instance
    ioModule   = require('socket.io'),
    io         = ioModule.listen(server, { log: false });

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

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// save test case
app.post('/api/testcase',function(req,res) {
    var newTestCase = new TestCase({
            id: generateID(),
            name: req.body.name,
            url: req.body.startURL,
            maxTime: req.body.maxTime,
            targetElem: req.body.targetElem,
            targetAction: req.body.targetAction,
            cookies: req.body.cookies
        });

    newTestCase.save();

    console.log('TestCase %s saved!',newTestCase.id);
    res.send(newTestCase);
});

// save test case
app.get('/watch/:id',function(req,res) {
    TestCase.find({'id':req.params.id},function(err,testCase) {
        res.set('Content-Type', 'text/html');
        res.send(testCase);
    });
});

// store mouse position
// io.sockets.on('connection', function(socket) {

//     socket.on('startTestCase', function (id, fn) {
//         TestCase.findOne( { 'id' : id } , function(err,testCase) {
//             fn(testCase);
//         });
//     });

//     socket.on('mousePosition', function(data) {
//         // console.log(socket.id);
//         TestCase.findOne({'id':data.id},function(err,testCase) {
//             testCase.mousePositions.push({ x: data.x, y: data.y });
//             testCase.save();
//         });
//         console.log('new mouse position for test case %s: [x:%s,y:%s]', data.id, data.x, data.y);
//     });
// });

// start server to listen on port 80
server.listen(9001);
console.log('### app is listen on http://localhost:80 ###');