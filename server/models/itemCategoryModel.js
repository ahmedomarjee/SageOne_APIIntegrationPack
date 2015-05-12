var mongoose = require('mongoose');

var itemCategorySchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String
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

var category = mongoose.model('ItemCategory', itemCategorySchema);

module.exports = category;
