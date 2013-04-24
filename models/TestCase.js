// define vars
var mongoose = require('mongoose'),

    // create test case schema and model
    schema   = new mongoose.Schema( {
        id:           'string',
        name:         'string',
        url:          'string',
        targetElem:   'string',
        targetAction: 'string',
        mousePositions: [{ x: Number, y: Number }]
    }),
    TestCase = mongoose.model('TestCase',schema);

exports.model = TestCase;