// Imports 
const bcrypt = require('bcrypt');
const models = require('../models');
const jwtUtils = require('../utils/jwt.utils');
const asyncLib = require('async');

// Création des regex pour le mail et le mot de passe
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Routes
module.exports = {
    // Fonction register
    register: function (req, res) {
        asyncLib.waterfall([
            function (done) {
                // Vérifier si l'utilisateur existe déjà
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: req.body.email }
                }).then(function (userFound) {
                    done(null, userFound);
                }).catch(function (err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
            },
            function (userFound, done) {
                if (!userFound) {
                    // Sécuriser le mot de passe
                    bcrypt.hash(req.body.password, 5, function (err, bcryptedPassword) {
                        done(null, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'user already exist' });
                }
            },
            function (bcryptedPassword, done) {
                let newUser = models.User.create({
                    email: req.body.email,
                    username: req.body.username,
                    password: bcryptedPassword,
                    isAdmin: 0
                }).then(function (newUser) {
                    done(null, newUser);
                }).catch(function (err) {
                    return res.status(500).json({ 'error': 'unable to add user' });
                });
            }
        ], function (err, newUser) {
            if (!err) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({ 'error': 'unable to add user' });
            }
        });
    },

    // Fonction login
    login: function (req, res) {
        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: { email: req.body.email }
                }).then(function (userFound) {
                    done(null, userFound);
                }).catch(function (err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
            },
            function (userFound, done) {
                if (userFound) {
                    bcrypt.compare(req.body.password, userFound.password, function (errBycrypt, resBycrypt) {
                        done(errBycrypt, userFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({ 'error': 'user not exist in DB' });
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    done(null, userFound);
                } else {
                    return res.status(403).json({ 'error': 'invalid password' });
                }
            }
        ], function (err, userFound) {
            if (!err) {
                return res.status(200).json({
                    'userId': userFound.id,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
            } else {
                return res.status(500).json({ 'error': 'unable to log in user' });
            }
        });
    },
    // Fonction getUserProfile
    getUserProfile: function (req, res) {
        // Récupérer l'en-tête d'autorisation
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        // Vérifier si l'utilisateur existe
        if (userId < 0)
            return res.status(400).json({ 'error': 'wrong token' });

        // Récupérer l'utilisateur
        models.User.findOne({
            attributes: ['id', 'username'],
            where: { id: userId }
        }).then(function (user) {
            if (user)
                res.status(201).json(user);
            else
                res.status(404).json({ 'error': 'user not found' });
        }).catch(function (err) {
            res.status(500).json({ 'error': 'cannot fetch user' });
        });
    },
    updateUserProfile: function (req, res) {
        // Récupérer l'en-tête d'autorisation
        let headerAuth = req.headers['authorization'];
        let userId = jwtUtils.getUserId(headerAuth);

        // Paramètres
        let username = req.body.username;

        asyncLib.waterfall([
            // Vérifier si l'utilisateur existe
            function (done) {
                models.User.findOne({
                    attributes: ['id', 'username'],
                    where: { id: userId }
                }).then(function (userFound) {
                    done(null, userFound);
                }).catch(function (err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
            },
            // Mettre à jour l'utilisateur
            function (userFound, done) {
                if (userFound) {
                    userFound.update({
                        username: (username ? username : userFound.username)
                    }).then(function () {
                        done(userFound);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'cannot update user' });
                    });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
            // Récupérer l'utilisateur
            function (userFound) {
                if (userFound) {
                    return res.status(201).json(userFound);
                } else {
                    return res.status(500).json({ 'error': 'cannot update user profile' });
                }
            }

        ])
    }
}
