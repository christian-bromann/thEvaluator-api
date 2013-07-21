/**
 * change testcase object
 * [PUT] /api/testcase/:id
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 * @returns {Object} changed testcase object
 */

var TestCase = require('../../models/TestCase').model,
    Task     = require('../../models/Task').model;

exports.type     = 'put';
exports.url      = '/api/testcase/:id';
exports.callback = function(req,res) {

    var taskOrder = [],
        cnt = 0;

    // find testcase by given ID
    TestCase.findOne({_id:req.params.id},function(err,testcase) {

        // on error return with status 500
        if(!testcase) {
            res.send(500);
            return;
        }

        // change testcase attributes
        testcase.setAttributes(req.body);

        // update task objects
        req.body.tasks.forEach(function(reqTask,i) {
            Task.findOne({_id: reqTask._id}, function(err,task) {

                // on error return with status 500
                if(err) {
                    res.send(500);
                    return;
                }

                // if task already exist, just change its attributes
                if(task) {
                    task.setAttributes(reqTask);

                // if task doesn't exist, create new task object
                } else {
                    task = new Task(reqTask);
                    task._testcase = testcase._id;
                }

                // keep task order as array
                taskOrder[i] = task._id;

                // persist task
                task.save(function(err,task) {
                    ++cnt;
                    console.log('Task %s updated!',task._id);

                    if(cnt < req.body.tasks.length) return;

                    // update task array of testcase
                    testcase.tasks = taskOrder;

                    saveTestcase(res,testcase,function() {
                        // remove tasks
                        cleanUpTasks(testcase._id,taskOrder);
                    });
                });
            });
        });
    });
};

/**
 * remove tasks which are not in request message
 * @param  {String} fromID     testcase ID
 * @param  {Array}  taskOrder  array of task IDs
 */
var cleanUpTasks = function(fromID,taskOrder) {

    // find all tasks of testcase
    Task.find({_testcase: fromID}, function(err,tasks) {

        // on error return with status 500
        if(err) {
            res.send(500);
            return;
        }

        var found = false;
        for(var i = 0; i < tasks.length; ++i) {

            // check if task is in request
            for(var j = 0; j < taskOrder.length; ++j) {
                if(tasks[i]._id.equals(taskOrder[j])) {
                    found = true;
                    break;
                }
            }

            // remove task if not
            if(!found) {
                console.log('remove task with name: "' + tasks[i].name + '" and ID ' + tasks[i]._id);
                tasks[i].remove();
            }

            found = false;
        }

    });

};

/**
 * save testcase and execute callback
 * @param  {Object}   res       response
 * @param  {Object}   testcase  testcase to persist
 * @param  {Function} cb        callback gets executed after storing
 */
var saveTestcase = function(res,testcase,cb) {
    testcase.save(function(err) {
        if(!err) {
            // returns with saved testcase
            console.log('TestCase %s updated!',testcase._id);
            res.set('Content-Type', 'application/json');
            res.send(testcase);
            cb();
        } else {
            // on error return with status 500
            res.send(500);
        }
    });
};