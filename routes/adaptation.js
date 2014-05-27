/**
 * Created by root on 10/05/14.
 */

'use strict';

module.exports = function(app) {

	var multipart = require('connect-multiparty');
	var multipartMiddleware = multipart();

	var userDAO = require('../api/dao/userDAO');
	var productDAO = require('../api/dao/productDAO');

	app.post('/test', function(req, res) {
		console.log('ca marche !!!')
		res.send(200, req.body);
	});

	app.post('/ajouterProduit', multipartMiddleware, productDAO.addItem);

};