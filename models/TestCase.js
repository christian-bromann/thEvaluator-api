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
    });

schema.methods.setAttributes = function(obj) {
    this.name    = obj.name;
    this.url     = obj.url;
    this.maxTime = obj.maxTime;
    this.cookies = obj.cookies;
};

exports.model = mongoose.model('TestCase',schema);