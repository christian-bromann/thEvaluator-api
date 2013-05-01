var TestCase = require('../../models/TestCase');

exports.url = '/api/testcase/:id?';
exports.callback = function(req,res) {
    var query = req.params.id ? {id:req.params.id} : {};
    console.log(TestCase);
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