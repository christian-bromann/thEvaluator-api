var fs = require('fs');

var routes = module.exports = function(app) {

    var routes = fs.readdirSync('./routes').filter(function(elem) { return elem.indexOf('.') === -1; });

    routes.forEach(function(elem,i,routes) {

        var rest = fs.readdirSync('./routes/'+elem).map(function(service){

            var type = service.replace('.js',''),
                ret  = {};

            service = require('./' + elem + '/' + service);
            service.type = type;

            if(app[type]) {
                app[type](service.url,service.callback);
            }

            return service;

        });

        routes[elem] = rest;
        routes.splice(i,1);
    });

    app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    });

    app.options('*',function(req,res) {
        res.send(200);
    });

    return routes;
};