const mongoose = require('mongoose');
const { questionSchema } = require('./question');

const documentSchema= new mongoose.Schema({
    documentId:{type: String, auto: false },
    documentName:{type: String,required: true},
    documentDescription:{type: String},
    createOn: {type: Date, default: Date.now},
    updateOn:{type: Date, default: Date.now},
    questions: [questionSchema]

});

module.exports =mongoose.model('Document', documentSchema);
