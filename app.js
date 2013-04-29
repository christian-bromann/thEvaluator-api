/* jshint -W024 */
/* jshint expr:true */

// define vars
var application_root = __dirname,

    // require models and node modules
    express    = require("express"),
    path       = require('path'),
    http       = require('http'),
    mongoose   = require('mongoose'),

    TestCase   = require('./models/TestCase').model,
    Task       = require('./models/Task').model,
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
            id:      generateID(),
            name:    req.body.name,
            url:     req.body.url,
            maxTime: req.body.maxTime,
            cookies: req.body.cookies
        });

    newTestCase.save(function(err) {

        if(err) {
            res.send(500);
            return false;
        }

        for(var i = 0; i < req.body.tasks.length; ++i) {
            var reqTask = req.body.tasks[i],
                newTask = new Task({
                    name:         reqTask.name,
                    description:  reqTask.description,
                    required:     reqTask.required,
                    targetElem:   reqTask.targetElem,
                    targetAction: reqTask.targetAction,
                    _testcase:    newTestCase._id
                });

            newTask.save();
            newTestCase.tasks.push(newTask._id);
            newTestCase.save();
            console.log('Task %s saved!',newTask._id);
        }

        console.log('TestCase %s saved!',newTestCase.id);
        res.set('Content-Type', 'application/json');
        res.send(newTestCase);

    });
});

app.get('/api/testcase/:id?',function(req,res) {
    var query = req.params.id ? {id:req.params.id} : {};
    TestCase
        .find(query)
        .populate('tasks')
        .exec(function(err,testCases) {

            if(!testCases) {
                res.send(500);
                return;
            }

            res.set('Content-Type', 'application/json');
            res.send(req.params.id ? testCases[0] : testCases);
        });
});

app.delete('/api/testcase/:id',function(req,res) {
    TestCase.find({'_id':req.params.id}).remove();
    console.log('TestCase %s removed!',req.params.id);
    res.send(200);
});

app.put('/api/testcase/:id',function(req,res) {
    var taskOrder = [],
        cnt = 0;

    TestCase.findOne({_id:req.params.id},function(err,testcase) {

        if(!testcase) {
            res.send(500);
            return;
        }

        testcase.name = req.body.name;
        testcase.url = req.body.url;
        testcase.maxTime = req.body.maxTime;
        testcase.targetElem = req.body.targetElem;
        testcase.targetAction = req.body.targetAction;
        testcase.cookies = req.body.cookies;

        for(var i = 0; i < req.body.tasks.length; ++i) {
            Task.findOne({_id: req.body.tasks[i]._id}, function(err,task) {

                if(err) {
                    res.send(500);
                    return;
                }

                if(task) {
                    task.name         = this.reqTask.name;
                    task.description  = this.reqTask.description;
                    task.required     = this.reqTask.required;
                    task.targetElem   = this.reqTask.targetElem;
                    task.targetAction = this.reqTask.targetAction;
                } else {
                    task = new Task({
                        name:         this.reqTask.name,
                        description:  this.reqTask.description,
                        required:     this.reqTask.required,
                        targetElem:   this.reqTask.targetElem,
                        targetAction: this.reqTask.targetAction,
                        _testcase:    testcase._id
                    });
                }

                taskOrder[this.i] = task._id;
                task.save(function(err,task) {
                    ++cnt;
                    console.log('Task %s updated!',task._id);

                    if(cnt === req.body.tasks.length) {
                        testcase.tasks = taskOrder;
                        testcase.save();

                        // clean up deleted tasks
                        Task.find({_testcase: testcase._id}, function(err,tasks) {

                            if(err) {
                                res.send(500);
                                return;
                            }

                            var found = false;
                            for(var i = 0; i < tasks.length; ++i) {
                                for(var j = 0; j < taskOrder.length; ++j) {
                                    if(tasks[i]._id.equals(taskOrder[j])) {
                                        found = true;
                                        break;
                                    }
                                }

                                if(!found) {
                                    console.log('remove task with name: "' + tasks[i].name + '" and ID ' + tasks[i]._id);
                                    tasks[i].remove();
                                }

                                found = false;
                            }

                        });
                    }
                });

            }.bind({reqTask: req.body.tasks[i], i: i}));
        }

        testcase.save(function(err) {
            if(!err) {
                console.log('TestCase %s updated!',req.params.id);
                res.set('Content-Type', 'application/json');
                res.send(testcase);
            } else {
                res.send(500);
            }
        });
    });
});

app.get('/watch/:id',function(req,res) {
    TestCase.find({'id':req.params.id},function(err,testCase) {
        res.set('Content-Type', 'text/html');
        res.send(testCase);
    });
});

app.options('*',function(req,res) {
    res.send(200);
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
server.listen(9001);
console.log('### app is listen on http://localhost:80 ###');