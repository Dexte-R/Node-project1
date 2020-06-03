// Model: "models" folder
// View: "views" folder
// Controller: "routes" folder

// each route should have their own views folder

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// express is the web framework 
const express = require('express')
const app = express()
// ejs is the templating language used
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')


// view engine to render HTML elements dynamically
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(methodOverride('_method'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// import routes
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

// process.env returns object containing user env
app.listen(process.env.PORT || 3000)

