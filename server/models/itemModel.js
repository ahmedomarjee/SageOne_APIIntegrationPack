var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'ItemCategory'
    },
    quantityOnHand: {
        type: Number
    },
    priceExclusive: {
        type: Number
    },
    priceInclusive: {
        type: Number
    },  
    taxTypeIdSales: {
        type: Number
    },
    taxTypeIdPurchases: {
        type: Number
    },
    sageone_id: {
        type: Number
    },
    modified: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});

var category = mongoose.model('Item', itemSchema);

module.exports = category;
