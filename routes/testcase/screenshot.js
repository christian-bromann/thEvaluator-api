var TestCase = require('../../models/TestCase').model,
    fs       = require('fs');

exports.type     = 'get';
exports.url      = '/api/testcase/:id/screenshot.jpg';
exports.callback = function(req,res) {

    var id  = req.params.id,
        url = req.query.url;

    if(!url || !id) {
        res.send(404);
    }

    var file = 'screenshots/' + id + '_' + encodeURIComponent(url) + '.jpeg';
    fs.stat(file, function (err, stat) {

        if(err) {
            res.send(404);
            return;
        }

        var img = fs.readFileSync(file);
        res.contentType = 'image/jpeg';
        res.contentLength = stat.size;
        res.end(img, 'binary');
    });

};