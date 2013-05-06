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
        maxTime:      Number,
        _testcase:    { type: Schema.ObjectId, ref: 'TestCase' }
    });

schema.methods.setAttributes = function(obj) {
    this.name         = obj.name;
    this.description  = obj.description;
    this.required     = obj.required;
    this.targetElem   = obj.targetElem;
    this.targetAction = obj.targetAction;
    this.maxTime      = obj.maxTime;
};

exports.model = mongoose.model('Task',schema);