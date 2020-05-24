// Model: "models" folder
// View: "views" folder
// Controller: "routes" folder

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// express is the web framework 
const express = require('express')
const app = express()
// ejs is the templating language used
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index')

// view engine to render HTML elements dynamically
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)

// process.env returns object containing user env
app.listen(process.env.PORT || 3000)
