var fs = require('fs');

var routes = module.exports = function(app) {

    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    app.options('*',function(req,res) {
        res.send(200);
    });

    var routes     = {},
        routePaths = fs.readdirSync('./routes').filter(function(elem) { return elem.indexOf('.') === -1; });

    routePaths.forEach(function(elem,i) {

        console.log('register '+elem);
        var rest = fs.readdirSync('./routes/'+elem).map(function(service){

            var ret = {};

            service = require('./' + elem + '/' + service);

            if(app[service.type]) {
                console.log('register REST service [%s] %s',service.type,service.url);
                app[service.type](service.url,service.callback);
            }

            return service;

        });

        routes[elem] = rest;

    });

    return routes;
};