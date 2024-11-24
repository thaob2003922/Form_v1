const mongoose = require('mongoose');
// const { accessTypeSchema } = require('./accesstype');

const shareFormSchema= new mongoose.Schema({
    documentId: {type: String, required: true},
    accesstype: {type: mongoose.Schema.Types.ObjectId, ref: 'AccessType', required: true},
    invitees: { type: [String], default: [] }, 
});

module.exports =mongoose.model('ShareForm', shareFormSchema);