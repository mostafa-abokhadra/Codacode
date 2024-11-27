require('dotenv').config()
const express = require("express")
const path = require("path")
const homeRoute = require('./src/routes/homeRoute')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoute)

app.listen(3000 || process.env.PORT, () => {
    console.log("i'm listening")
})