var TestCase = require('../models/TestCase').model;

var connections = module.exports = function(socket) {

    socket.on('getTestcase', function (id, fn) {
        TestCase
            .findOne({ 'id' : id })
            .populate('tasks')
            .exec(function(err,testcase) {
                fn(testcase);
            });
    });

    socket.on('mousePosition', function(data) {
        // console.log(socket.id);
        // TestCase.findOne({'id':data.id},function(err,testCase) {
        //     testCase.mousePositions.push({ x: data.x, y: data.y });
        //     testCase.save();
        // });
        console.log('new mouse position for test case %s: [x:%s,y:%s]', data.id, data.x, data.y);
    });

};