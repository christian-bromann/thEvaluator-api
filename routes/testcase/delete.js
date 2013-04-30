var TestCase = require('/models/TestCase');

exports.url = '/api/testcase/:id';
exports.callback = function(req,res) {

    TestCase.find({'_id':req.params.id}).remove();
    console.log('TestCase %s removed!',req.params.id);
    res.send(200);

};