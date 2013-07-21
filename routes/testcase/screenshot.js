/**
 * provides screenshot of given URI
 * [GET] /api/testcase/:id/screenshot.jpg
 *
 * @author Christian Bromann <mail@christian-bromann.com>
 * @returns {Image} screenshot of given URI
 */

var TestCase = require('../../models/TestCase').model,
    fs       = require('fs');

exports.type     = 'get';
exports.url      = '/api/testcase/:id/screenshot.jpg';
exports.callback = function(req,res) {

    var id  = req.params.id,
        url = req.query.url;

    // return with status 404 if screenshot wasn't found
    if(!url || !id) {
        res.send(404);
    }

    var file = 'screenshots/' + id + '_' + encodeURIComponent(url) + '.jpeg';

    // grab file from system
    fs.stat(file, function (err, stat) {

        // on error return with status 500
        if(err) {
            res.send(500);
            return;
        }

        // assign file content to variable
        var img = fs.readFileSync(file);
        res.contentType = 'image/jpeg';
        res.contentLength = stat.size;
        res.end(img, 'binary');
    });

};