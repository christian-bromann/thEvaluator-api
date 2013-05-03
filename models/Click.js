// define vars
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

    // create test case schema and model
    schema   = new mongoose.Schema({
        timestamp:   Number,
        x:           Number,
        y:           Number,
        innerWidth:  Number,
        innerHeight: Number,
        scrollX:     Number,
        scrollY:     Number,
        url:         String,
        _task:       { type: Schema.ObjectId, ref: 'Task' },
        _testcase:   { type: Schema.ObjectId, ref: 'TestCase' }
    });

schema.methods.setAttributes = function(obj) {
    this.timestamp   = obj.timestamp;
    this.x           = obj.x;
    this.y           = obj.y;
    this.innerWidth  = obj.innerWidth;
    this.innerHeight = obj.innerHeight;
    this.scrollX     = obj.scrollX;
    this.scrollY     = obj.scrollY;
    this.url         = obj.url;
    this._task       = obj._task;
    this._testcase   = obj._testcase;
};

exports.model = mongoose.model('Task',schema);