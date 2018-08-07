const Order = require('../models/order')

exports.orders_get_all = (req, res, next) => {
    Order.find()
    .populate('product', 'name') //it brings referenced detals data 
    .exec()
    .then(docs => {
        console.log(docs)
        if(docs.length){
            res.status(200).json(docs)
        }else{
            res.status(404).json({message: 'No entries found.'})    
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}