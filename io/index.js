var TestCase      = require('../models/TestCase').model,
    TestRun       = require('../models/TestRun').model,
    EventPosition = require('../models/EventPosition').model;

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

};