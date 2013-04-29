// define vars
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

    // create test case schema and model
    schema   = new mongoose.Schema({
        id:           String,
        timestamp:    { 'type': Date,   'default': Date.now },
        name:         String,
        url:          String,
        maxTime:      Number,
        cookies:      Array,
        tasks:        [{type: Schema.ObjectId, ref: 'Task'}]
    }),
    TestCase = mongoose.model('TestCase',schema);

exports.model = TestCase;