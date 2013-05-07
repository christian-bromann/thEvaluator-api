// define vars
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

    // create test case schema and model
    schema   = new mongoose.Schema({
        timestamp: { 'type': Date,   'default': Date.now },
        x:         Number,
        y:         Number,
        url:       String,
        _task:     { type: Schema.ObjectId, ref: 'Task' },
        _testrun:  { type: Schema.ObjectId, ref: 'TestRun' }
    });

schema.methods.setAttributes = function(obj) {
    this.x           = obj.x;
    this.y           = obj.y;
    this.url         = obj.url;
    this._task       = obj._task;
    this._testrun    = obj._testrun;
};

exports.model = mongoose.model('Click',schema);