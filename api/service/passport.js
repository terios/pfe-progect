"use strict"
// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../../models/Users');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'login',
            passwordField: 'password',
            fullNameField: 'fullName',
            emailField: 'email',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, login, password, fullName, email, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                console.log('searching for user');
                User.findOne({
                    'local.login': login
                }, function(err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        console.log(err);
                        return done(400, {
                            code: -1,
                            message: 'internal server error searching in database'
                        });
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(200, {
                            code: 0,
                            message: 'login already used'
                        });
                    } else {
                        console.log('no user whit the same login');
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.local.login = login;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.email = email;
                        newUser.local.fullName = fullName;
                        newUser.local.acces = 1;
                        newUser.local.avatar = '';
                        console.log(newUser);
                        console.log('going to save');
                        // save the user
                        newUser.save(function(err) {
                            if (err) {
                                console.log(err);
                                console.log('erreu hna aaaaaa');
                                throw err;
                            } else {
                                console.log("saved  user =========+> ");
                                console.log(newUser);
                                return done(null, newUser);
                            }
                        });
                    }

                });

            });

        }));


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            loginField: 'login',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, login, password, fullName, email, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({
                'local.login': login
            }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err) {
                    return done(400,err);
                }

                // if no user is found, return the message
                if (!user) {
                    return done(400, null);
                }
                // if the user is found but the password is wrong
                if (!user.validPassword(password)) {
                    return done(400, null);
                }
                // all is well, return successful user
                return done(null, user);
            });

        }));

};