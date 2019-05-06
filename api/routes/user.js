// authentication using jsonwebtoken
const express = require('express')
const router = express.Router()


const UserController = require('../controller/user')

//include middlewares
const checkAuth = require('../middleware/check-auth')

router.post('/signup', UserController.store)

router.post('/login', UserController.authenticate)

router.delete('/:userId', checkAuth, UserController.delete)

module.exports = router