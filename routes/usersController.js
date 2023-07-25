// Imports 
const bcrypt = require('bcrypt');
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');

// Routes
module.exports = {
    // Fonction register
    register: function (req, res) {
        // Params
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;

        // Si il manque un ou plusieurs paramètre
        if (email == null || username == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        // TODO vérifier les paramètres
        // Ne pas le faire est une faille de sécurité

        // Vérifier si l'utilisateur existe déjà
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
            .then(function (userFound) {
                // Si l'utilisateur n'existe pas
                if (!userFound) {
                    // Sécuriser le mot de passe
                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        const newUser = models.User.create({
                            email: email,
                            username: username,
                            password: bcryptedPassword,
                            isAdmin: 0
                        })
                            // Enregistrer le nouvel utilisateur
                            .then(function (newUser) {
                                return res.status(201).json({
                                    'userId': newUser.id
                                })
                            })
                    });
                    // Si l'utilisateur existe déjà
                } else {
                    return res.status(409).json({ 'error': 'user already exist' });
                }

            })
            // Si il y a une erreur
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
    },


    // Fonction login
    login: function (req, res) {
        // Params
        let email = req.body.email;
        let password = req.body.password;

        // Si il manque un ou plusieurs paramètre
        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        models.User.findOne({
            where: { email: email }
        })
            .then(function (userFound) {
                // Si l'utilisateur existe
                if (userFound) {
                    // Comparer les mots de passe
                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        if (resBycrypt) {
                            return res.status(200).json({
                                'userId': userFound.id,
                                'token': jwtUtils.generateTokenForUser(userFound)
                            });
                        } else {
                            return res.status(403).json({ 'error': 'invalid password' });
                        }

                    });


                } else {
                    return res.status(404).json({ 'error': 'user not exist in DB' });
                }

            })
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });

    }
}
