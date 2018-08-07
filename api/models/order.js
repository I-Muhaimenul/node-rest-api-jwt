const mongoose = require('mongoose')

const productScheme = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}, //ref is for relation. not useful for mongodb
    quantity: { type: Number, default: 1}
})

module.exports = mongoose.model('Order', productScheme)