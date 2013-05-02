var TestCase = require('../models/TestCase').model;

var connections = module.exports = function(socket) {

	socket.on('startTestCase', function (id, fn) {
        TestCase.findOne( { 'id' : id } , function(err,testCase) {
            fn(testCase);
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