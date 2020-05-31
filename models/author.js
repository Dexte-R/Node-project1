const mongoose = require('mongoose')

// scheme in layman's term: blueprint
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

// model created and exported for use by the controller
module.exports = mongoose.model('Author', authorSchema)