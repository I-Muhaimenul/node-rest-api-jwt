//inclue packages
const express = require('express')
const router = express.Router()

//include middlewares
const checkAuth = require('../middleware/check-auth')

//include models

//include controllers here some routes methodes are called from controller for example. but should be called all methods
const OrdersController = require('../controller/orders')

//routes
router.get('/', checkAuth, OrdersController.orders_get_all)

router.post('/', OrdersController.create_order)

router.get('/:orderId', OrdersController.single_order)

router.patch('/:orderId', OrdersController.update_order)

router.delete('/:orderId', OrdersController.delete_order)

module.exports = router