//Declaration
var http = require('http'),
    express = require('express'),
    importers = require('importers'),
    fs = require('fs'),
    test = require('test'),
    app = express();


var statement;

console.log(test.version);
test.on('data', function (data) {
    console.log('Test Module Sent Data ' + data);
});
test.TestEvent('Hello World');

importers.on('ready', function () {
    console.log(importers.OFX.version);
    importers.OFX.on('data', function(data) {
            console.log('data from ofx event ' + data);
        });
    
    importers.OFX.test_event('something');
    console.log('ready');
    
    fs.readFile('./OFX/sample.OFX', function (err, data) {
        //console.log(data);
        statement = importers.OFX.parseOFX(data);
        console.log("accnt " + statement.acctID);
        console.log("ammount " + statement.transactions[124].trn_amount);
    })

});
importers.loadModules();

app.configure(function () {
    app.use('port', process.env.PORT || 8000);
    app.use('/', express.static(__dirname + '/public'));

});


app.get('/api/*', function (req, res) {
    console.log("Request " + req.path);
    //res.send('Hello World');
    switch (req.path) {
        case "/api/statement":
            var json_statement = JSON.stringify(statement);
            res.end(json_statement);
            break;
        default:
            res.end("no endpoint");
            break;
    }
});


var server = http.createServer(app, function () {
    console.log('App Server Started on ' + app.get('port'));
});

server.listen(8000);