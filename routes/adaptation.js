/**
 * Created by root on 10/05/14.
 */

'use strict';

module.exports = function(app, passport) {

	var multipart = require('connect-multiparty');
	var multipartMiddleware = multipart();

	// var userDAO = require('../api/dao/userDAO');
	var productDAO = require('../api/dao/productDAO');

	//passport service check if user is loged
	function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on
		console.log('in isloggedIN');
		console.log(req.isAuthenticated());
		if (req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		res.jsonp(400, {
			code: -1,
			message: 'unauthrized'
		});
	}

	app.post('/test', function(req, res) {
		res.send(200, req.body);
	});

	app.post('/ajouterProduit', multipartMiddleware, productDAO.addItem);
	app.post('/getAllProducts', productDAO.getAllProducts);
	app.post('/getProductsById', productDAO.findById);

	//service passport
	//passport service signin
	app.post('/signup', passport.authenticate('local-signup', {
			failureRedirect: '/#/',
			failureFlash: true
		}),
		function(req, res) {
			console.log('success saving user in database');
			res.jsonp(200, req.user);
		});
	//passport service login
	app.post('/login', passport.authenticate('local-login', {
			failureRedirect: '/#/',
			failureFlash: true
		}),
		function(req, res) {
			if (req.user) {
				res.jsonp(200, req.user);
			} else {
				console.log('sending result');
				res.jsonp(400, null);

			}

		});
	app.get('/profile', isLoggedIn, function(req, res) {
		res.jsonp(200, req.user);
	});

};