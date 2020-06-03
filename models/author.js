const mongoose = require('mongoose')
const Book = require('./books')

// scheme in layman's term: blueprint
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const books = await Book.find({ author: this.id })
    if (books.length > 0) {
        next(new Error('Author still has books saved.'))
    } else {
        next()
    }
})

// model created and exported for use by the controller
module.exports = mongoose.model('Author', authorSchema)