var TestCase   = require('../../models/TestCase').model,
	Task       = require('../../models/Task').model,
	generateID = require('../../utils/generateID');

exports.type     = 'post';
exports.url      = '/api/testcase';
exports.callback = function(req,res) {

    var newTestCase = new TestCase({
            id:         generateID(),
            name:       req.body.name,
            url:        req.body.url,
            cookies:    req.body.cookies,
            resolution: req.body.resolution
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
                    maxTime:      reqTask.maxTime,
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
};