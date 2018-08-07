const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

//details way to use multer to upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        // cb(null, file.filename) 
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})
// additional file validation
const fileFilter = (req, file, cb) => {
    //reject a file cb(null, false)
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        // new Error('message') instead of null
        cb(null, false)
    }
    
}
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 *1024 },
    fileFilter: fileFilter
})
// const upload = multer({dest: 'uploads/'})

const Product = require('../models/product')

router.get('/', (req, res, next) => {
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
})

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
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
})

router.get('/:productId', (req, res, next) => {
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
})

router.patch('/:productId', (req, res, next) => {
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
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id }).exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })

})

module.exports = router