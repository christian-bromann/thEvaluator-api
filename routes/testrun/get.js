var TestCase = require('../../models/TestRun').model;

exports.type     = 'get';
exports.url      = '/api/testrun/:id?';
exports.callback = function(req,res) {
    var query = req.params.id ? {id:req.params.id} : {};

    TestCase
        .find(query)
        .populate('_testcase clicks')
        .exec(function(err,testRun) {

            if(!testRun) {
                res.send(500);
                return;
            }

            res.set('Content-Type', 'application/json');
            res.send(req.params.id ? testRun[0] : testRun);
        });
};