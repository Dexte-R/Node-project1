const express = require('express')
const router = express.Router()
const Book = require('../models/books')

router.get('/', async (req, res) => {
    try {
        const books = await Book.find({}).sort({ createdAt: 'desc' }).limit(5)
        res.render('index', { books: books })
    } catch {
        res.render('index', { books: new Book() })
    }
})

module.exports = router