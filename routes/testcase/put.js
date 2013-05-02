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

        testcase.name = req.body.name;
        testcase.url = req.body.url;
        testcase.maxTime = req.body.maxTime;
        testcase.targetElem = req.body.targetElem;
        testcase.targetAction = req.body.targetAction;
        testcase.cookies = req.body.cookies;

        for(var i = 0; i < req.body.tasks.length; ++i) {
            Task.findOne({_id: req.body.tasks[i]._id}, function(err,task) {

                if(err) {
                    res.send(500);
                    return;
                }

                if(task) {
                    task.name         = this.reqTask.name;
                    task.description  = this.reqTask.description;
                    task.required     = this.reqTask.required;
                    task.targetElem   = this.reqTask.targetElem;
                    task.targetAction = this.reqTask.targetAction;
                } else {
                    task = new Task({
                        name:         this.reqTask.name,
                        description:  this.reqTask.description,
                        required:     this.reqTask.required,
                        targetElem:   this.reqTask.targetElem,
                        targetAction: this.reqTask.targetAction,
                        _testcase:    testcase._id
                    });
                }

                taskOrder[this.i] = task._id;
                task.save(function(err,task) {
                    ++cnt;
                    console.log('Task %s updated!',task._id);

                    if(cnt === req.body.tasks.length) {
                        testcase.tasks = taskOrder;
                        testcase.save();

                        // clean up deleted tasks
                        Task.find({_testcase: testcase._id}, function(err,tasks) {

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
                    }
                });

            }.bind({reqTask: req.body.tasks[i], i: i}));
        }

        testcase.save(function(err) {
            if(!err) {
                console.log('TestCase %s updated!',req.params.id);
                res.set('Content-Type', 'application/json');
                res.send(testcase);
            } else {
                res.send(500);
            }
        });
    });
};