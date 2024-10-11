const moogoose = require('moogoose');

const userResponseSchema = new moogoose.Schema({
    documentId: {type: String, ref: 'Document', required: true},
    userId: {type: String, ref: 'User', required: true},
    submittedOn: {type: Date, default: Date.now},
    answers : {}
})

module.exports = moogoose.model('UserResponse', userResponseSchema);