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
	var imgIdArray = [];
	var counter = 0;
	console.log(req.files);
	if (!req.files.uploadedFile || req.files.uploadedFile.length < 1) {
		console.log('aucun fichier uploader vide');
		return res.jsonp(500, {
			'code': -1,
			'message': 'aucune image n\'est presente'
		});
	} else {
		console.log('des fichier on ete inclus');
		if (req.files.uploadedFile instanceof Array) {
			for (var i = 0; i < req.files.uploadedFile.length; i++) {
				fileReaded = fs.readFileSync(req.files.uploadedFile[i].path);
				console.log(process.env.FILE_PATH + '/' + encodeURIComponent(req.files.uploadedFile[i].name));
				arrayBase64.push({
					name: req.files.uploadedFile[i].name,
					data: process.env.FILE_PATH + '/' + encodeURIComponent(req.files.uploadedFile[i].name)
				});
				fs.writeFileSync(process.env.FILE_PATH + '/' + encodeURIComponent(req.files.uploadedFile[i].name), fileReaded);
				console.log("The file created!");
				console.log('file saved')
			}
		} else {
			console.log(process.env.FILE_PATH + '/' + encodeURIComponent(req.files.uploadedFile.name));
			fileReaded = fs.readFileSync(req.files.uploadedFile.path);
			fs.writeFile(process.env.FILE_PATH + '/' + encodeURIComponent(req.files.uploadedFile.name), fileReaded, function(err) {
				if (err) {
					console.log(err);
				} else {
					console.log("The file was saved!");
				}
			});
			arrayBase64.push({
				name: req.files.uploadedFile.name,
				data: process.env.FILE_PATH + '/' + encodeURIComponent(req.files.uploadedFile.name)
			});
		}

		console.log(arrayBase64);
		console.log(arrayBase64.length);
		var images = [];
		for (var i = 0; i < arrayBase64.length; i++) {
			console.log('inside for of images');
			images[i] = new Images();
			images[i].name = arrayBase64[i].name;
			images[i].data = arrayBase64[i].data;
			console.log(images[i]);
			images[i].save(function(err) {
				if (err) {
					console.log(err);
					throw err;
				} else {
					// console.log(images._id);
					// console.log(counter);
					// imgIdArray.push(images[i]._id);
					// console.log(images.getAllImagesId());
					counter++;
					if (counter === arrayBase64.length) {
						for (var i = 0; i < images.length; i++) {
							imgIdArray.push(images[i]._id);
						}
						// console.log(images);
						// console.log('================');
						// console.log(imgIdArray);
						var newProduct = new Product();
						newProduct.name = productData.name;
						newProduct.categorie = productData.categorie;
						newProduct.description = productData.description;
						newProduct.price = productData.price;
						newProduct.amount = productData.amount;
						newProduct.gain = 0;
						newProduct.sold = 0;
						newProduct.pics = imgIdArray;
						newProduct.save(function(err) {
							if (err) {
								console.log(err);
								throw err;
							} else {
								global.io.sockets.emit('newProductNotification', {
									lastItem: newProduct
								});
								console.log('sending result to client');
								return res.jsonp(200, {
									'code': 1,
									'message': 'un nouveau Produit a ete ajouter'
								});
							}
						});
					}
				}
			});
		}
	}
};


exports.getAllProducts = function(req, res) {

	Images.find({}, '_id', function(err, images) {
		if (err) {
			console.log('erreur');
		} else {
			console.log(images);
		}
	});

	Product.find({}, function(err, products) {
		if (err) {
			return res.jsonp(500, {
				'code': -1,
				'message': 'Erreur lors de la recuperation'
			});
		} else {
			return res.jsonp(200, products);
		}
	});
};


exports.findById = function(req, res) {
	var id = req.body.idProduct;
	Product
		.findById(id)
		.populate('pics')
		.exec(function(err, produit) {
			if (err) {
				return res.jsonp(400, {
					'produit': 'une erreur innatendu '
				});
			} else {
				return res.jsonp(200, produit);
			}
		});
};