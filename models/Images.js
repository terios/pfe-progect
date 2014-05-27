/**
 * Created by root on 10/05/14.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
// define the schema for our user model
var imageSchema = mongoose.Schema({

	name: String,
	data: String,
	productId: {
		type: ObjectId,
		ref: 'productSchema'
	}
});


// create the model for users and expose it to our app
module.exports = mongoose.model('Images', imageSchema);