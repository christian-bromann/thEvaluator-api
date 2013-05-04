var TestCase = require('../../models/TestCase').model;

exports.type     = 'delete';
exports.url      = '/api/testcase/:id';
exports.callback = function(req,res) {

    TestCase.find({'_id':req.params.id}).remove();
    console.log('TestCase %s removed!',req.params.id);
    res.send(200);

};