/**
 * get testruns from testcase ID
 * [GET] /api/testrun/byTestcase/:id
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 * @param {String} id  testcase ID
 * @returns {Array} all testruns of testcase
 */

var TestRun = require('../../models/TestRun').model;

exports.type     = 'get';
exports.url      = '/api/testrun/byTestcase/:id';
exports.callback = function(req,res) {
    var query = { _testcase: req.params.id };

    // find all testruns
    TestRun
        // by given testcase ID
        .find(query)
        // replace document IDs with its object values
        .populate('_testcase clicks moves')
        .exec(function(err,testRuns) {

            // on error return with status code 500
            if(!testRuns) {
                res.send(500);
                return;
            }

            res.set('Content-Type', 'application/json');
            res.send(testRuns);
        });
};