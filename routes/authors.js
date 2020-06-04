const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/books')

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
        await author.save()
        res.redirect('/authors')
    } catch {
        res.render('authors/new', {
        author: author,
        errorMessage: 'Error when creating Author.'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: req.params.id }).limit(5)
        res.render('authors/show', {
            author: author,
            books: books
        })
    } catch {
        res.redirect('/authors')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch {
        res.redirect('/authors')
    }
})

// browser can only send GET and POST requests by default
// middleware needed to use PUT and DELETE
// PUT request to update route
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        // both of these redirects are the same
        // res.redirect(`${author.id}`)
        res.redirect(`/authors/${author.id}`)
    } catch {
        // failed to search author
        // author search can only fail if the database was changed not by the user?
        if (author == null) {
            res.redirect('/')
        } else {
            // failed to save author
            res.render('authors/edit', {
                author: author,
                errorMessage: "Error when updating Author."
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.deleteOne()
        console.log('author deleted')
        res.redirect('/authors')
    } catch {
        // failed to search author
        if (author == null) {
            res.redirect('/')
        } else {
            // failed to delete author
            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports = router

// reset my Model
async function deleteAllData() {
    try {
        await Author.deleteMany()
        await Book.deleteMany()
        console.log("All data removed from model.")
    } catch (err) {
        console.log(err)
    }
}
// deleteAllData()


// argument for rediret is a relative route in current router `/route`
// argument for render is an ejs file in views folder