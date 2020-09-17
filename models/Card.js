const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const cardSchema = new Schema({
  slots: {
    type: [{ index: Number, number: Number, marked: Boolean }],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
});

module.exports = model('Card', cardSchema);
