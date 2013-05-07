// define vars
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

    // create test case schema and model
    schema   = new mongoose.Schema({
        timestamp:   { 'type': Date,   'default': Date.now },
        clicks:      [{type: Schema.ObjectId, ref: 'Click'}],
        geoData: {
            city:        String,
            countryCode: String,
            countryName: String,
            host:        String,
            lang:        String,
            latitude:    Number,
            longitude:   Number,
            region:      String,
            timezone:    String
        },
        screenshots: [String],
        _testcase:   { type: Schema.ObjectId, ref: 'TestCase' }
    });

schema.methods.setAttributes = function(obj) {
    this.timestamp   = obj.timestamp;
    this.x           = obj.x;
    this.y           = obj.y;
    this.url         = obj.url;
    this._task       = obj._task;
    this._testcase   = obj._testcase;
};

exports.model = mongoose.model('TestRun',schema);