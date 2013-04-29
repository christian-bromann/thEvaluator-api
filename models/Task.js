// define vars
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

    // create test case schema and model
    schema   = new mongoose.Schema({
        name:         String,
        description:  String,
        required:     Boolean,
        targetElem:   String,
        targetAction: String,
        _testcase:    { type: Schema.ObjectId, ref: 'TestCase' }
    }),
    Task = mongoose.model('Task',schema);

exports.model = Task;