var TestCase      = require('../models/TestCase').model,
    TestRun       = require('../models/TestRun').model,
    EventPosition = require('../models/EventPosition').model,
    fs            = require('fs');

var connections = module.exports = function(socket) {

    socket.on('getTestcase', function (id, fn) {
        TestCase
            .findOne({ 'id' : id })
            .populate('tasks')
            .exec(function(err,testcase) {
                fn(testcase);
            });
    });

    socket.on('clickPosition', function(data) {

        var click = new EventPosition(data);

        click.save(function(err,click) {

            if(err) {
                console.error('couldn\'t save click');
                process.exit(1);
            }

            // add click to testrun
            TestRun.findOne({ _id: data._testrun }, function(err, testrun) {

                if(err || !testrun) {
                    console.error('couldn\'t find testrun for click %s',click._id);
                    process.exit(1);
                }

                testrun.clicks.push(click._id);
                testrun.save(function() {

                    if(err) {
                        console.error('couldn\'t update testrun');
                        process.exit(1);
                    }

                    console.log('new mouse position for testrun %s and task %s: [x:%s,y:%s]', testrun._id, data._task, data.x, data.y);
                });

            });
        });
    });

    // TODO encapsulate into own file
    socket.on('movePosition', function(data) {

        var move = new EventPosition(data);

        move.save(function(err,move) {

            if(err) {
                console.error('couldn\'t save move');
                process.exit(1);
            }

            // add move to testrun
            TestRun.findOne({ _id: data._testrun }, function(err, testrun) {

                if(err || !testrun) {
                    console.error('couldn\'t find testrun for move %s',move._id);
                    process.exit(1);
                }

                testrun.moves.push(move._id);
                testrun.save(function() {

                    if(err) {
                        console.error('couldn\'t update testrun');
                        process.exit(1);
                    }

                    console.log('new mouse position for testrun %s and task %s: [x:%s,y:%s]', testrun._id, data._task, data.x, data.y);
                });

            });
        });
    });

    socket.on('init', function(data,fn) {

        var testrun = new TestRun(data);

        testrun.save(function(err,testrun) {

            if(err) {
                console.error('couldn\'t save testrun');
                process.exit(1);
            }

            fn(testrun);

            console.log('created new testrun for testcase %s, user with ip %s is from %s', testrun._testcase, testrun.geoData.host, testrun.geoData.city);
        });
    });

    socket.on('geoData', function(data,fn) {

        TestRun.findOne({ _id: data._id }, function(err, testrun) {

            if(err || !testrun) {
                console.error('couldn\'t end testrun with id %s',data._id);
                process.exit(1);
            }

            testrun.geoData = data.geoData;
            testrun.save(function() {

                if(err) {
                    console.error('couldn\'t update testrun');
                    process.exit(1);
                }

                console.log('updated geoData of testrun', data.geoData);
            });

        });

    });

    socket.on('endTestrun', function(data,fn) {

        TestRun.findOne({ _id: data.id }, function(err, testrun) {

            if(err || !testrun) {
                console.error('couldn\'t end testrun with id %s',data.id);
                process.exit(1);
            }

            testrun.status = data.status;
            testrun.save(function() {

                if(err) {
                    console.error('couldn\'t update testrun');
                    process.exit(1);
                }

                console.log('updated status of testrun to %d', data.status);
            });

        });

    });

    socket.on('screenshot', function(data) {
        var base64Data   = data.imageData.replace(/^data:image\/jpeg;base64,/,""),
            decodedImage = new Buffer(base64Data, 'base64'),
            imagePath    = 'screenshots/' + data.testcase._id + '_' + encodeURIComponent(data.url) + '.jpeg';

        fs.writeFile( imagePath, decodedImage, 'base64', function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('The screenshot was saved at %s!',imagePath);

                TestCase.findOne({ _id : data.testcase._id }, function(err,testcase) {
                    testcase.screenshots.push({
                        path: imagePath,
                        url:  data.url
                    });
                    testcase.save();
                });
            }
        });
    });

    socket.on('pagevisit', function(data,fn) {

        TestRun.findOne({ _id: data.id }, function(err, testrun) {

            if(err || !testrun) {
                console.error('couldn\'t end testrun with id %s',data.id);
                process.exit(1);
            }

            testrun.visits.push({
                url: data.url,
                task: data.task,
                timestamp: new Date().getTime()
            });
            testrun.save(function() {

                if(err) {
                    console.error('couldn\'t update testrun');
                    process.exit(1);
                }

                console.log('added pagevisit to testrun (url: %s)', data.url);
            });

        });

    });

};