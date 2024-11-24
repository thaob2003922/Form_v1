const mongoose = require('mongoose');
const { questionSchema } = require('./question');

const documentSchema= new mongoose.Schema({
    documentId:{type: String, auto: false },
    documentName:{type: String,required: true},
    documentDescription:{type: String},
    userId:{type:String,required: true},
    createOn: {type: Date, default: Date.now},
    updateOn:{type: Date, default: Date.now},
    questions: [questionSchema],
    accessLevel: { type: String, enum: ['anyone', 'inviteOnly', 'restricted'], default: 'anyone' },
    invitees: { type: [String], default: [] }, 
});

module.exports =mongoose.model('Document', documentSchema);
