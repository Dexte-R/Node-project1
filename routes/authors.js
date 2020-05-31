const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// get authors
router.get('/', async (req, res) => {
    let searchOptions = {}
    // get request sendd info through query; post request send info with forms
    if (req.query.name != null && req.query.name !== "") {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors', { authors: authors, searchOptions: req.query })
    } catch {
        res.redirect('/')
    }
})

// get to author creation page
router.get('/new', (req, res) => {
    // additional params passed to ejs file if coming from 'edit' route
    // new Author() creates an author object that can be saved to the db in future
    res.render('authors/new', { author: new Author() })
})

// create new author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        console.log("author saved")
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
        author: author,
        errorMessage: 'Error when creating Author.'
        })
    }
})

module.exports = router

// reset my Model
async function deleteAllData() {
    try {
        await Author.deleteMany()
        console.log("All data removed from model.")
    } catch (err) {
        console.log(err)
    }
}
// deleteAllData()