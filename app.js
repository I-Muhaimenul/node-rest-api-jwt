const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// const productRoutes = require('./api/routes/products')
// const orderRoutes = require('./api/routes/orders')
// const userRoutes = require('./api/routes/user')
const routes = require('./api/routes')

//mongoose connect with mongodb atlas. it can also be done local mongodb easily
// mongoose.connect( 'mongodb+srv://username:'+ process.env.MONGO_ATLAS_PW +'@node-rest-dsafx.mongodb.net/test?retryWrites=true',
//     // 'mongodb://username:'+ encodeURIComponent(process.env.MONGO_ATLAS_PW) +'@node-rest-shard-00-00-dsafx.mongodb.net:27017,node-rest-shard-00-01-dsafx.mongodb.net:27017,node-rest-shard-00-02-dsafx.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shard-0&authSource=admin&retryWrites=true',
//     {
//     //    useMongoClient: true
//         useNewUrlParser: true
//     },
//     () => {
//         console.log('Mongodb connected')
//     }
// ).catch(err => {console.log(err)})
// for connecting mlab
const mongoUri = '\'' + process.env.DB_ENGINE + '://' +  process.env.MLAB_USERNAME + ':' +  process.env.MLAB_PW + '@' +  process.env.MLAB_HOST + '/' +  process.env.DB_NAME + '\'';
mongoose.Promise = global.Promise //for deprication warning
mongoose.connect(mongoUri, { useNewUrlParser: true })
  .then(() =>  console.log('Mlab connection succesful'))
  .catch((err) => console.error(err))

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads')) //making upload folder public
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
})

//Routes
app.get('/', (req, res) => {
    res.send('MongoExpNode REST App Running from heroku! Goto /orders or /prducts or /signup.')
})

app.use('/products', routes.productRoutes)
app.use('/orders', routes.orderRoutes)
app.use('/user', routes.userRoutes)

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            message: err.message
        }
    })
})


module.exports = app