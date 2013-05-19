var TestCase = require('../../models/TestCase').model;

exports.type     = 'get';
exports.url      = '/api/testcase/:id?';
exports.callback = function(req,res, next) {

    var query = req.params.id ? req.params.id.length > 10 ? {_id:req.params.id} : {id:req.params.id} : {};

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
};