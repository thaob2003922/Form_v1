const mongoose = require('mongoose');

const userResponseSchema = new mongoose.Schema({
    documentId: {type: String, ref: 'Document', required: true},
    userId: {type: String, ref: 'User', required: true},
    submittedOn: {type: Date, default: Date.now},
    answers : {}
})

module.exports = mongoose.model('UserResponse', userResponseSchema);