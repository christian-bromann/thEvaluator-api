/**
 * get all testcases or one special
 * [GET] /api/testcase/:id?
 *
 * @author Christian Bromann <mail@christian-bromann>
 * @returns {Object} one or an array of testcases
 */

var TestCase = require('../../models/TestCase').model;

exports.type     = 'get';
exports.url      = '/api/testcase/:id?';
exports.callback = function(req,res, next) {

    // if id is given find testcase by id otherwise find all testcases
    var query = req.params.id ? req.params.id.length > 10 ? {_id:req.params.id} : {id:req.params.id} : {};

    TestCase
        // find testcase by query
        .find(query)
        // replace mongo document ID of all tasks with its JSON content
        .populate('tasks')
        // execute function
        .exec(function(err,testCases) {

            // if no testcase was found return with status code 500
            if(!testCases) {
                res.send(500);
                return;
            }

            // set response headers
            res.set('Content-Type', 'application/json');
            // send found testcase(s)
            res.send(req.params.id ? testCases[0] : testCases);
        });
};