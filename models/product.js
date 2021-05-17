const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create a Schema
const productSchema = Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        enum: ['fruit', 'vegetable', 'dairy']
    },
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
    }
})

// Create a Model using above Schema
const Product = mongoose.model('Product', productSchema)

module.exports = Product;