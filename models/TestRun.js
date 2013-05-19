// define vars
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

    // define model schema
    schema   = new mongoose.Schema({
        timestamp:   { 'type': Date, 'default': Date.now },

        /**
         * list of click positions
         * @type {Array}
         */
        clicks:      [{ type: Schema.ObjectId, ref: 'EventPosition'}],

        /**
         * list of move positions
         * @type {Array}
         */
        moves:       [{ type: Schema.ObjectId, ref: 'EventPosition'}],

        /**
         * list of page visits
         * @type {Array}
         */
        visits: [{
            timestamp: Date,
            url:       String
        }],

        /**
         * users geoinformation by smart-ip.net
         * e.g.
         *   city: "Berlin"
         *   countryCode: "DE"
         *   countryName: "Germany"
         *   host: "85.179.166.71"
         *   lang: "en"
         *   latitude: 52.5167
         *   longitude: 13.4
         *   region: "Berlin"
         *   timezone: "Europe/Berlin"
         *
         * @type {Object}
         */
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

        /**
         * current status of testrun
         * 0 - running
         * 1 - ended successful
         * 2 - ended with timeout
         * 3 - canceled
         * 
         * @type {Number}
         */
        status:      { 'type': Number, 'default': 0 },

        /**
         * testcase id
         * @type {Schema.ObjectId}
         */
        _testcase:   { 'type': Schema.ObjectId, 'ref': 'TestCase' }
    });

/**
 * set attributes by given object
 * @param  {Object} obj  object with model attributes
 */
schema.methods.setAttributes = function(obj) {
    this.timestamp   = obj.timestamp;
    this.x           = obj.x;
    this.y           = obj.y;
    this.url         = obj.url;
    this._task       = obj._task;
    this._testcase   = obj._testcase;
};

// export model
exports.model = mongoose.model('TestRun',schema);
