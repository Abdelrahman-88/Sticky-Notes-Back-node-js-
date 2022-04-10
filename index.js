const express = require('express')
require('dotenv').config()
var cors = require('cors')
const dbConnection = require('./common/connection/confg')
const {
    userRouter,
    noteRouter,
    paymentRoutes
} = require('./common/router/allRouter')
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())
app.use(userRouter, noteRouter, paymentRoutes)
dbConnection()



app.listen(port, () => console.log(`this server is runnig on port ${port}!`))