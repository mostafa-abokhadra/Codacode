require('dotenv').config()
const express = require("express")
const path = require("path")
const app = express()
const flash = require('express-flash');
const passport = require('./src/config/localAuthStrategy')

const session = require('./src/middlewares/session')
const homeRoute = require('./src/routes/homeRoute')
const authRoute = require('./src/routes/authRoutes')
const dashboardRoute = require('./src/routes/dashboard')
const postRoute = require('./src/routes/postRoutes')
const requestsRoute = require("./src/routes/requestsRoutes")
const projectRoute = require("./src/routes/projectRoutes")


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/src/public')));


app.use(session)
app.use(flash()); 
app.use(passport.initialize())
app.use(passport.session())


app.use('/', homeRoute)
app.use('/auth', authRoute)
app.use('/', dashboardRoute)
app.use('/', postRoute)
app.use('/', requestsRoute)
app.use('/', projectRoute)

app.listen(process.env.PORT)

module.exports = app