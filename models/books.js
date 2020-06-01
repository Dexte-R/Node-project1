const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/bookCovers'

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
    coverImageName: {
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
    if (this.coverImageName != null) {
            return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

// model created and exported for use by the controller
module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath