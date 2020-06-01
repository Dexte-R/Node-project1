const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/books')
const path = require('path')
const fs = require('fs')
// multer is used for multipart forms which may contain files
const multer = require('multer')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (request, fileItem, callback) => {
        callback(null, imageMimeTypes.includes(fileItem.mimetype))
    }
})

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
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    console.log(fileName)
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        // input field for type="date" returns a date string
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })   
    console.log(book)
    try {
        const newBook = await book.save()
        console.log('Book saved')
        res.redirect('books')
    } catch {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
            console.log('deleted')
        }
        renderNewPage(res, book, hasError = true)
    }
})

function removeBookCover(filename) {
    fs.unlink(path.join(uploadPath, filename), err => {
        if (err) console.error(err)
    })
}

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

module.exports = router
