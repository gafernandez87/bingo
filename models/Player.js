const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const playerSchema = new Schema({
  name: String,
  taken: Boolean,
  card: {
    type: Schema.Types.ObjectId,
    ref: 'Card',
  },
});

module.exports = model('Player', playerSchema);
