const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

const ProductController = require('../controller/product')

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


router.get('/', ProductController.index)

router.post('/', checkAuth, upload.single('productImage'), ProductController.store)

router.get('/:productId', ProductController.show)

router.patch('/:productId', ProductController.update)

router.delete('/:productId', ProductController.delete)

module.exports = router