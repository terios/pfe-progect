/**
 * Created by root on 10/05/14.
 */

var mongoose = require('mongoose');
// define the schema for our user model
var productSchema = mongoose.Schema({

    name: String,
    categorie: String,
    description: String,
    price: Number,
    amount: Number
});


module.exports = mongoose.model('Product', productSchema);