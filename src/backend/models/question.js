const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    optionText:{ type: String, required: true},
})
module.exports = optionSchema;

const questionSchema = new mongoose.Schema({
    documentId: { type: String, auto: false },
    questionText: { type: String },
    questionType: { type: String },
    options: [optionSchema],
    open: { type: Boolean },
    required: { type: Boolean }
});

module.exports = questionSchema;
module.exports = {
    optionSchema,
    questionSchema
};