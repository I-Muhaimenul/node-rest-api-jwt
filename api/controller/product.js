const mongoose = require('mongoose')

// model
const Product = require('../models/product')

module.exports = {
    index : (req, res, next) => {
        Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            console.log(docs)
            // for customize respone
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            if(docs.length){
                res.status(200).json(response)
            }else{
                res.status(404).json({message: 'No entries found.'})    
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    },

    store : (req, res, next) => {
        console.log(req.file)
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path
        })
        product.save().then(
            result => {
                console.log('result')
                res.status(201).json({
                    message: 'Created Product Successfully',
                    createdProduct: {
                        name: result.name,
                        price: result.price,
                        _id: result._id
                    }
                })
            }
        ).catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
    },

    show : (req, res, next) => {
        const id = req.params.productId
        Product.findById(id).exec()
        .then(doc => {
            console.log(doc)
            if(doc){
                res.status(200).json(doc)
            }else{
                res.status(404).json({message: 'No Valid entry found for provided ID.'})    
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    },

    update : (req, res, next) => {
        const id = req.params.productId
        const updateOps = {}
        for(const ops of req.body){
            updateOps[ops.propName] = ops.value
        }
        // Product.update({ _id: id }, { $set: {name: req.body.newName, price: req.body.newPrice}}).exec()
        Product.update({ _id: id }, { $set: updateOps }).exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    },

    delete : (req, res, next) => {
        const id = req.params.productId
        Product.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    
    }
}