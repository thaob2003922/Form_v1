const mongoose = require('mongoose');

const accessTypeSchema= new mongoose.Schema({
   name: {type: String, required: true},
   description: {type: String }
});

module.exports =mongoose.model('AccessType', accessTypeSchema);