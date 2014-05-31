'use strict';

var mongoose = require('mongoose');
var Images = mongoose.model('Images');

exports.getAllImages = function(req, res) {

	Images.find({}, function(err, iamges) {
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