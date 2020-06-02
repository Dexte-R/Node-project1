const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/books')
// const uploadPath = path.join('public', Book.coverImageBasePath)
// // multer is used for multipart forms which may contain files
// const multer = require('multer')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (request, fileItem, callback) => {
//         callback(null, imageMimeTypes.includes(fileItem.mimetype))
//     }
// })

// get books
router.get('/', async (req, res) => {
    let query = Book.find({})
    if (req.query.title != null && req.query.title != "") {
        query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
        query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
        query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books', { books: books, searchOptions: req.query })
    } catch {
        res.redirect('books')
    }
})

// get to book creation page
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// create new book
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        // input field for type="date" returns a date string
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })   
    saveCover(book, req.body.cover)
    try {
        const newBook = await book.save()
        console.log('Book saved')
        res.redirect('books')
    } catch {
        renderNewPage(res, book, hasError = true)
    }
})


async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = "Error creating book."
        res.render('books/new', params)
    } catch {
        res.redirect('books')
    }
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        // convert covert data from base64 to hexadecimal
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router
