var TestRun = require('../../models/TestRun').model;

exports.type     = 'get';
exports.url      = '/api/testrun/byTestcase/:id';
exports.callback = function(req,res) {
    var query = { _testcase: req.params.id };

    TestRun
        .find(query)
        .populate('_testcase clicks')
        .exec(function(err,testRuns) {

            if(!testRuns) {
                res.send(500);
                return;
            }

            res.set('Content-Type', 'application/json');
            res.send(testRuns);
        });
};