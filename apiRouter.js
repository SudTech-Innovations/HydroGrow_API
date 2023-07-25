// Créer un routeur API 

// Importer express
const express = require('express');

// Importer le contrôleur users
const usersCtrl = require('./routes/usersController');

// Créer le routeur
exports.router = (function () {
    let apiRouter = express.Router();

    // Définir les routes
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);

    return apiRouter;
}
)();