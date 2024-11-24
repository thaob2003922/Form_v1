const mongoose = require('mongoose');

const userFormRelatedSchema = new mongoose.Schema({
    userId: {type: String, ref: 'User', required: true},
    documentId: {type: String, ref: 'Document', required: true},
    shareFormURL: { type: String, default: '' },
    status: {type: String, default: 'pending'},
})
module.exports = mongoose.model('UserFormRelated', userFormRelatedSchema);  