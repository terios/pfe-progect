'use strict';

var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Images = mongoose.model('Images');
var socket = require('../../routes/socket.js');


var fs = require('fs');

exports.addItem = function(req, res) {
	// console.log(req.files);

	var productData = JSON.parse(req.body.productData);
	var fileReaded = '';
	var bufferedFile = '';
	var arrayBase64 = [];
	var counter = 0;

	if (!req.files.uploadedFile || req.files.uploadedFile.length < 1) {
		console.log('aucun fichier uploader vide');
		return res.jsonp(500, {
			'code': -1,
			'message': 'aucune image n\'est presente'
		});
	} else {
		console.log('des fichier on ete inclus');
		// for (var i = 0; i < req.files.uploadedFile.length; i++) {
		// 	filesToUpload.push(req.files.uploadedFile[i]);
		// }
		console.log(req.files.uploadedFile);

		if (req.files.uploadedFile instanceof Array) {
			for (var i = 0; i < req.files.uploadedFile.length; i++) {
				fileReaded = fs.readFileSync(req.files.uploadedFile[i].path);
				bufferedFile = new Buffer(fileReaded).toString('base64');
				arrayBase64.push({
					name: req.files.uploadedFile[i].name,
					data: bufferedFile
				});
			}
		} else {
			fileReaded = fs.readFileSync(req.files.uploadedFile.path);
			bufferedFile = new Buffer(fileReaded).toString('base64');
			arrayBase64.push({
				name: req.files.uploadedFile.name,
				data: bufferedFile
			});
		}

		var newProduct = new Product();
		newProduct.name = productData.name;
		newProduct.categorie = productData.categorie;
		newProduct.description = productData.description;
		newProduct.price = productData.price;
		newProduct.amount = productData.amount;
		newProduct.save(function(err) {
			if (err) {
				console.log(err);
				throw err;
			} else {
				for (var i = 0; i < arrayBase64.length; i++) {
					console.log('inside for of images');
					var images = new Images();
					images.name = arrayBase64[i].name;
					images.data = arrayBase64[i].data;
					images.productId = newProduct._id;
					images.save(function(err) {
						if (err) {
							console.log(err);
							throw err;
						} else {
							counter++;
							if (counter === arrayBase64.length) {

								global.io.sockets.emit('second', {
									name: 'return the last item to be added to the view'
								});
								console.log('sending result to client');
								return res.jsonp(200, {
									'code': 1,
									'message': 'un nouveau Produit a ete ajouter'
								});
							}
						}
					});
				}
			}
		});
	}


};