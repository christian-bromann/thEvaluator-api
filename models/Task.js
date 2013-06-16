// define vars
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

    // define schema
    schema   = new mongoose.Schema({

        /**
         * task name
         * @type {String}
         */
        name:         String,

        /**
         * task description
         * @type {String}
         */
        description:  String,

        /**
         * if true, testrun ends if task isn't solved on timeout
         * @type {Boolean}
         */
        required:     Boolean,

        /**
         * if true, event propagates
         * @type {Boolean}
         */
        propagate:    Boolean,

        /**
         * target element
         * @type {String}
         */
        targetElem:   String,

        /**
         * event type of targetElem to solve the task
         * @type {String}
         */
        targetAction: String,

        /**
         * max amount of time to solve the task
         * @type {[type]}
         */
        maxTime:      Number,

        /**
         * testcase ID
         * @type {String}
         */
        _testcase:    { type: Schema.ObjectId, ref: 'TestCase' }
    });

/**
 * set attributes by given object
 * @param  {Object} obj  object with model attributes
 */
schema.methods.setAttributes = function(obj) {
    this.name         = obj.name;
    this.description  = obj.description;
    this.required     = obj.required;
    this.propagate    = obj.propagate;
    this.targetElem   = obj.targetElem;
    this.targetAction = obj.targetAction;
    this.maxTime      = obj.maxTime;
};

// export model
exports.model = mongoose.model('Task',schema);