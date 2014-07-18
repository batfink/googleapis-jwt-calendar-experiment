var http = require('http');
var fs = require('fs');
var handlebars = require('handlebars');
var helpers = require('./src/helpers');

var template = handlebars.compile(fs.readFileSync('src/template.hbs').toString());
var json = JSON.parse(fs.readFileSync('src/calendar.json'));

http.createServer(function(req, res) {
    res.writeHead(200, { "Context-Type" : "text/html" });
    res.write(template(json));
    res.end();
}).listen(8000);

console.log('server started on port 8000');
