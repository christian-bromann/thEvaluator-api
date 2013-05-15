// define vars
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

    // define schema
    schema   = new mongoose.Schema({

        /**
         * date the event takes place
         * @type {Date}
         */
        timestamp: { 'type': Date,   'default': Date.now },

        /**
         * x coordinate of current mouse position
         * @type {Integer}
         */
        x:         Number,

        /**
         * y coordinate of current mouse position
         * @type {Integer}
         */
        y:         Number,

        /**
         * current URL
         * @type {String}
         */
        url:       String,

        /**
         * task reference
         * @type {String}
         */
        _task:     { type: Schema.ObjectId, ref: 'Task' },

        /**
         * testrun reference
         * @type {String}
         */
        _testrun:  { type: Schema.ObjectId, ref: 'TestRun' }
    });

/**
 * set attributes by given object
 * @param  {Object} obj  object with model attributes
 */
schema.methods.setAttributes = function(obj) {
    this.x           = obj.x;
    this.y           = obj.y;
    this.url         = obj.url;
    this._task       = obj._task;
    this._testrun    = obj._testrun;
};

// export model
exports.model = mongoose.model('EventPosition',schema);