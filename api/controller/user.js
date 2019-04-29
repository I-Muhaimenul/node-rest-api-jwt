// authentication using jsonwebtoken
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

module.exports = {
    store : (req, res, next) => {
        User.find({email: req.body.email})
        .exec().then(user => {
            if(user.length >= 1){
                //422 error can be use
                return res.status(409).json({
                    message: 'Mail Exists!'
                })
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => { //10 is a salt. hash can be done without salt
                    if(err) {
                        return res.status(500).json({
                            error: err
                        })
                    }else{ 
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save().then(
                            result => {
                                console.log(result)
                                res.status(201).json({
                                    message: 'Created user Successfully',
                                })
                            }
                        )
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({
                                error: err
                            })
                        })
                    } 
                })
            }
        })
    
    },

    authenticate : (req, res, next) => {
        User.find({email: req.body.email}).exec()
        .then(user => {
            // console.log(process.env.JWT_KEY)
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if(result){
                    // console.log(process.env.JWT_KEY)
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, 'secret', 
                    {
                        expiresIn: "1h"
                    })
    
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    },

    delete : (req, res, next) => {
        const id = req.params.userId
        User.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
                result: result
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
    }
}