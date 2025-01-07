const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'number', 'date', 'email', 'select'],
    required: true
  },
  required: {
    type: String,
    enum: ['false', 'true'],
    default: 'false',
    required: true
  },
  options: [{
    label: String,
    value: String
  }] // For select type fields
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fields: [fieldSchema]
});

const dataModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  categories: [categorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DataModel', dataModelSchema);