require('dotenv').config()
const express = require("express")
const path = require("path")

const app = express()
const {createServer} = require('http')
const server = createServer(app)
const socketHandler = require('./socket')
const io = require('socket.io')(server)
socketHandler(io)

const flash = require('express-flash');
const passport = require('./src/config/localAuthStrategy')

const session = require('./src/middlewares/session')
const homeRoute = require('./src/routes/homeRoute')
const authRoute = require('./src/routes/authRoutes')
const dashboardRoute = require('./src/routes/dashboard')
const postRoute = require('./src/routes/postRoutes')
const requestsRoute = require("./src/routes/requestsRoutes")
const projectRoute = require("./src/routes/projectRoutes")
const noAuthRoutes = require("./src/routes/noAuthRoutes")
const messageRoutes = require('./src/routes/messageRoutes')
const portfoliioRoutes = require('./src/routes/portfolioRoutes')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/src/public')));
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

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
app.use('/', noAuthRoutes)
app.use('/', messageRoutes)
app.use('/', portfoliioRoutes)

server.listen(process.env.PORT)

module.exports = server