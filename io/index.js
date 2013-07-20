/**
 * websockets event implementations
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 */

var TestCase      = require('../models/TestCase').model,
    TestRun       = require('../models/TestRun').model,
    EventPosition = require('../models/EventPosition').model,
    fs            = require('fs');

/**
 * export socket event implementations
 * @param  {Object} socket  object to register events provided by Socket.IO
 */
var connections = module.exports = function(socket) {

    /**
     * get testcase by id
     * @param  {String}   id  testcase ID
     * @param  {Function} fn  callback function with testcase as parameter
     */
    socket.on('getTestcase', function (id, fn) {

        TestCase
            // find testcase with id
            .findOne({ 'id' : id })
            // replace mongo document ID of all tasks with its JSON content
            .populate('tasks')
            // execute function
            .exec(function(err,testcase) {
                // execute callback
                fn(testcase);
            });

    });

    /**
     * persist click position and connect it to a testrun
     * @param  {Object} data  contains all defined attributes of EventPosition
     */
    socket.on('clickPosition', function(data) {

        // create new EventPosition object
        var click = new EventPosition(data);

        // persist Eventposition
        click.save(function(err,click) {

            // on error log message and exit API process
            if(err) {
                console.error('couldn\'t save click\n',err);
                process.exit(1);
            }

            // add click to testrun
            TestRun.findOne({ _id: data._testrun }, function(err, testrun) {

                if(err || !testrun) {
                    console.error('couldn\'t find testrun for click %s',click._id);
                    process.exit(1);
                }

                // add click EventPosition to testrun
                testrun.clicks.push(click._id);

                // persist changes
                testrun.save(function(err) {

                    // on error log message and exit API process
                    if(err) {
                        console.error('couldn\'t update testrun',err);
                        process.exit(1);
                    }

                    console.log('new mouse position for testrun %s and task %s: [x:%s,y:%s]', testrun._id, data._task, data.x, data.y);
                });

            });
        });
    });

    /**
     * persist current cursor position and connect it to a testrun
     * @param  {Object} data  contains all defined attributes of EventPosition
     */
    socket.on('movePosition', function(data) {

        // create new EventPosition object
        var move = new EventPosition(data);

        // persist Eventposition
        move.save(function(err,move) {

            // on error log message and exit API process
            if(err) {
                console.error('couldn\'t save move',err);
                process.exit(1);
            }

            // add move to testrun
            TestRun.findOne({ _id: data._testrun }, function(err, testrun) {

                if(err || !testrun) {
                    console.error('couldn\'t find testrun for move %s',move._id);
                    process.exit(1);
                }

                // add move EventPosition to testrun
                testrun.moves.push(move._id);

                // persist changes
                testrun.save(function(err) {

                    // on error log message and exit API process
                    if(err) {
                        console.error('couldn\'t update testrun',err);
                        process.exit(1);
                    }

                    console.log('new mouse position for testrun %s and task %s: [x:%s,y:%s]', testrun._id, data._task, data.x, data.y);
                });

            });
        });
    });

    /**
     * create new testrun entry in DB
     * @param  {Object}   data  contains information which testcase this testrun will be based on
     * @param  {Function} fn    callback function to return new testrun object
     */
    socket.on('init', function(data,fn) {

        // create new testrun object
        var testrun = new TestRun(data);

        // persist testrun
        testrun.save(function(err,testrun) {

            // on error log message and exit API process
            if(err) {
                console.error('couldn\'t save testrun',err);
                process.exit(1);
            }

            // return new testrun by executing given callback
            fn(testrun);

            console.log('created new testrun for testcase %s, user with ip %s is from %s', testrun._testcase, testrun.geoData.host, testrun.geoData.city);
        });
    });

    /**
     * persist geoData information in given testrun object
     * @param  {Object}   data  users geoData informations provided by http://smart-ip.net/
     */
    socket.on('geoData', function(data) {

        // find testrun by given ID
        TestRun.findOne({ _id: data._id }, function(err, testrun) {

            // on error or if no testrun was found, log message and exit API process
            if(err || !testrun) {
                console.error('couldn\'t end testrun with id %s',data._id);
                process.exit(1);
            }

            // add geoData information to testrun object
            testrun.geoData = data.geoData;

            // persist changes
            testrun.save(function(err) {

                // on error log message and exit API process
                if(err) {
                    console.error('couldn\'t update testrun',err);
                    process.exit(1);
                }

                console.log('updated geoData of testrun', data.geoData);
            });

        });

    });

    /**
     * change status of testrun
     * @param  {Object}   data  contains testrun id and its final status
     */
    socket.on('endTestrun', function(data) {

        // find testrun by given ID
        TestRun.findOne({ _id: data.id }, function(err, testrun) {

            // on error or if no testrun was found, log message and exit API process
            if(err || !testrun) {
                console.error('couldn\'t end testrun with id %s',data.id);
                process.exit(1);
            }

            // change testrun status
            testrun.status = data.status;

            // persist changes
            testrun.save(function(err) {

                // on error log message and exit API process
                if(err) {
                    console.error('couldn\'t update testrun',err);
                    process.exit(1);
                }

                console.log('updated status of testrun to %d', data.status);
            });

        });

    });

    /**
     * save screenshot to file system
     * @param  {Object} data  contains the base64 encoded screenshot image
     */
    socket.on('screenshot', function(data) {

            // remove base64 preamble
        var base64Data   = data.imageData.replace(/^data:image\/jpeg;base64,/,''),
            // create Buffer object base on base64 string
            decodedImage = new Buffer(base64Data, 'base64'),
            // define image oath
            imagePath    = 'screenshots/' + data.testcase._id + '_' + encodeURIComponent(data.url) + '.jpeg';

        // save file to system
        fs.writeFile( imagePath, decodedImage, 'base64', function(err) {

            // on error log message and exit API process
            if(err) {
                console.error('couldn\'t update testrun',err);
                process.exit(1);
            } else {
                console.log('The screenshot was saved at %s!',imagePath);

                // persist existence of this screenshot in testcase object
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

    /**
     * persist pagevisit
     * @param  {Object}   data  contains testrun ID, tab url and task ID
     */
    socket.on('pagevisit', function(data) {

        // find testrun by given ID
        TestRun.findOne({ _id: data.id }, function(err, testrun) {

            // on error or if no testrun was found, log message and exit API process
            if(err || !testrun) {
                console.error('couldn\'t end testrun with id %s',data.id);
                process.exit(1);
            }

            // add pagevisit
            testrun.visits.push({
                url: data.url,
                task: data.task,
                timestamp: new Date().getTime()
            });

            // save changes
            testrun.save(function(err) {

                // on error log message and exit API process
                if(err) {
                    console.error('couldn\'t update testrun',err);
                    process.exit(1);
                }

                console.log('added pagevisit to testrun (url: %s)', data.url);
            });

        });

    });

    /**
     * persist feedback text
     * @param  {Object}   data  contains testrun ID and feedback string
     */
    socket.on('feedback', function(data) {

        TestRun.findOne({ _id: data.id }, function(err, testrun) {

            // on error or if no testrun was found, log message and exit API process
            if(err || !testrun) {
                console.error('couldn\'t end testrun with id %s',data.id);
                process.exit(1);
            }

            // add feedback text with current timestamp
            testrun.feedback = {
                text: data.text,
                timestamp: new Date().getTime()
            };

            // save changes
            testrun.save(function(err) {

                // on error log message and exit API process
                if(err) {
                    console.error('couldn\'t update testrun',err);
                    process.exit(1);
                }

                console.log('added feedback to testrun');
            });

        });

    });

};