/**
 * get testrun by given ID
 * [GET] /api/testrun/:id?
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 * @param {String} id  testrun ID
 * @returns testrun of given ID
 */

var TestCase = require('../../models/TestRun').model;

exports.type     = 'get';
exports.url      = '/api/testrun/:id?';
exports.callback = function(req,res) {
    var query = req.params.id ? {id:req.params.id} : {};

    // find testrun
    TestCase
        // by given ID
        .find(query)
        // replace document IDs with its object values
        .populate('_testcase clicks moves')
        .exec(function(err,testRun) {

            if(!testRun) {
                res.send(500);
                return;
            }

            res.set('Content-Type', 'application/json');
            res.send(req.params.id ? testRun[0] : testRun);
        });
};