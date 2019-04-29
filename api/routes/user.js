// authentication using jsonwebtoken
const express = require('express')
const router = express.Router()


const UserController = require('../controller/user')

router.post('/signup', UserController.store)

router.post('/login', UserController.authenticate)

router.delete('/:userId', UserController.delete)

module.exports = router