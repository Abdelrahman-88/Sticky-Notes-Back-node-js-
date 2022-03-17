const express = require('express')
var cors = require('cors')
const dbConnection = require('./common/connection/confg')
const {
    userRouter,
    noteRouter
} = require('./common/router/allRouter')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors())
app.use(userRouter, noteRouter)
dbConnection()



app.listen(port, () => console.log(`this server is runnig on port ${port}!`))