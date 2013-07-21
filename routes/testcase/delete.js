/**
 * remove testcase by given ID
 * [DELETE] /api/testcase/:id
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 * @return STATUS 200 (no content)
 */

var TestCase = require('../../models/TestCase').model;

exports.type     = 'delete';
exports.url      = '/api/testcase/:id';
exports.callback = function(req,res) {

	// remove testcase with given id
    TestCase.find({'_id':req.params.id}).remove();
    console.log('TestCase %s removed!',req.params.id);

    // return with status 200
    res.send(200);

};