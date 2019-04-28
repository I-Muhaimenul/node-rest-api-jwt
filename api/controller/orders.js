//inclue packages
const express = require('express')
const mongoose = require('mongoose')

//include models
const Order = require('../models/order')
const Product = require('../models/product')

module.exports = {
    orders_get_all = (req, res, next) => {
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
    },

    create_order = (req, res, next) => {
        Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                productId: req.body.productId,
                quantity: req.body.quantity
            })
            return order.save().exec().then(
                result => {
                    console.log(result)
                    res.status(201).json({
                        message: 'Created order Successfully',
                        createdOrder: {
                            productId: result.productId,
                            quantity: result.quantity,
                            _id: result._id
                        }
                    })
                }
            )
            // .catch(err => {
            //     console.log(err)
            //     res.status(500).json({
            //         error: err
            //     })
            // })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found'
            })
        })
    },

    single_order = (req, res, next) => {
        const id = req.params.orderId
        Order.findById(id).exec()
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

    update_order = (req, res, next) => {
        const id = req.params.orderId
        const updateOps = {}
        for(const ops of req.body){
            updateOps[ops.propName] = ops.value
        }
        // Product.update({ _id: id }, { $set: {name: req.body.newName, price: req.body.newPrice}}).exec()
        Order.update({ _id: id }, { $set: updateOps }).exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    },

    delete_order = (req, res, next) => {
        const id = req.params.orderId
        Order.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Orer deleted',
                result: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    }
}
