/**
 * add testcase
 * [POST] /api/testcase
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 * @returns {Object} added testcase object
 */

var TestCase   = require('../../models/TestCase').model,
	Task       = require('../../models/Task').model,
	generateID = require('../../utils/generateID');

exports.type     = 'post';
exports.url      = '/api/testcase';
exports.callback = function(req,res) {

    // create new testcase object
    var newTestCase = new TestCase({
            id:         generateID(),
            name:       req.body.name,
            url:        req.body.url,
            cookies:    req.body.cookies,
            resolution: req.body.resolution
        });

    // persist testcase
    newTestCase.save(function(err) {

        // on error return with status 500
        if(err) {
            res.send(500);
            return false;
        }

        // persist testcase tasks
        for(var i = 0; i < req.body.tasks.length; ++i) {
            var reqTask = req.body.tasks[i],

                // create task object
                newTask = new Task({
                    name:         reqTask.name,
                    description:  reqTask.description,
                    required:     reqTask.required,
                    propagate:    reqTask.propagate,
                    targetElem:   reqTask.targetElem,
                    targetAction: reqTask.targetAction,
                    maxTime:      reqTask.maxTime,
                    _testcase:    newTestCase._id
                });

            // oersist task
            newTask.save();

            // add reference to testcase
            newTestCase.tasks.push(newTask._id);

            // perist testcase
            newTestCase.save();
            console.log('Task %s saved!',newTask._id);
        }

        // return with added object
        console.log('TestCase %s saved!',newTestCase.id);
        res.set('Content-Type', 'application/json');
        res.send(newTestCase);

    });
};