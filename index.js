const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;

const server = express();

// Utiliser le middleware body-parser pour parser les requêtes avec un corps JSON ou URL codé
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Définir la route racine
server.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>Serveur en marche</h1>');
});

// Utiliser le routeur apiRouter pour les routes sous le préfixe '/api/'
server.use('/api/', apiRouter);

// Lancer le serveur
server.listen(8080, function () {
    console.log('Serveur en marche');
});