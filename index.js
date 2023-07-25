// Imports 
var express = require('express');

// Instentiate server
var server = express();

// Configure routes
server.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Bonjour sur mon serveur</h1>');
});

// Launch server
server.listen(8080, function() {
    console.log('Serveur en marche');
});
