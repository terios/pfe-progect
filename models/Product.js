/**
 * Created by root on 10/05/14.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
// define the schema for our user model
var productSchema = mongoose.Schema({

    name: String,
    categorie: String,
    description: String,
    price: Number,
    amount: Number,
    gain: Number,
    sold: Number,
    created: {
        type: Date,
        default: Date.now
    },
    pics: [{
        type: ObjectId,
        ref: 'Images'
    }]
});


module.exports = mongoose.model('Product', productSchema);