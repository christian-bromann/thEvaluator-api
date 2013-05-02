var TestCase = require('../../models/TestCase').model,
    Task     = require('../../models/Task').model;

exports.type     = 'put';
exports.url      = '/api/testcase/:id';
exports.callback = function(req,res) {

    var taskOrder = [],
        cnt = 0;

    TestCase.findOne({_id:req.params.id},function(err,testcase) {

        if(!testcase) {
            res.send(500);
            return;
        }

        testcase.setAttributes(req.body);

        req.body.tasks.forEach(function(reqTask,i) {
            Task.findOne({_id: reqTask._id}, function(err,task) {

                if(err) {
                    res.send(500);
                    return;
                }

                if(task) {
                    task.setAttributes(reqTask);
                } else {
                    task = new Task(reqTask);
                    task._testcase = testcase._id;
                }

                taskOrder[i] = task._id;
                task.save(function(err,task) {
                    ++cnt;
                    console.log('Task %s updated!',task._id);

                    if(cnt < req.body.tasks.length) return;

                    testcase.tasks = taskOrder;
                    saveTestcase(res,testcase,function() {
                        cleanUpTasks(testcase._id,taskOrder);
                    });
                });
            });
        });
    });
};

var cleanUpTasks = function(fromID,taskOrder) {

    Task.find({_testcase: fromID}, function(err,tasks) {

        if(err) {
            res.send(500);
            return;
        }

        var found = false;
        for(var i = 0; i < tasks.length; ++i) {
            for(var j = 0; j < taskOrder.length; ++j) {
                if(tasks[i]._id.equals(taskOrder[j])) {
                    found = true;
                    break;
                }
            }

            if(!found) {
                console.log('remove task with name: "' + tasks[i].name + '" and ID ' + tasks[i]._id);
                tasks[i].remove();
            }

            found = false;
        }

    });

};

var saveTestcase = function(res,testcase,cb) {
    testcase.save(function(err) {
        if(!err) {
            console.log('TestCase %s updated!',testcase._id);
            res.set('Content-Type', 'application/json');
            res.send(testcase);
            cb();
        } else {
            res.send(500);
        }
    });
};