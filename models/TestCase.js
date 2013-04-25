// define vars
var mongoose   = require('mongoose'),

    // create test case schema and model
    schema   = new mongoose.Schema( {
        id:           String,
        timestamp:    { 'type': Date,   'default': Date.now },
        name:         String,
        url:          String,
        maxTime:      Number,
        targetElem:   String,
        targetAction: String,
        cookies:      Array,
        mousePositions: [{ x: Number, y: Number }]
    }),
    TestCase = mongoose.model('TestCase',schema);

exports.model = TestCase;