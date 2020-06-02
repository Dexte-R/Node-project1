const mongoose = require('mongoose')

// scheme in layman's term: blueprint
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        // if I use Date.now() I will get the creation Date of this schema instead of the creation Date of the new book
        default: Date.now
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

// virtual property works in the same way as the defined properties aobve
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
        // convert buffer to data object so it can be used as an image source directly in the html img tag
        // this is called data URI scheme that provides a way to include data in-line in web pages
        // the [;base64], indicates that the data string be parsed using base64 encoding
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

// model created and exported for use by the controller
module.exports = mongoose.model('Book', bookSchema)