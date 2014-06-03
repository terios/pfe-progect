'use strict';

var mongoose = require('mongoose');
var Images = mongoose.model('Images');

exports.getAllImages = function(req, res) {

	Images.find({}, function(err, images) {
		if (err) {
			return res.jsonp(500, {
				'code': -1,
				'message': 'Erreur lors de la recuperation'
			});
		} else {
			return res.jsonp(200, images);
		}
	});
};


exports.getAllImagesId = function() {

	Images.find({},'_id', function(err, images) {
		if (err) {
			return null;
		} else {
			return images;
		}
	});
};