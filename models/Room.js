const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const roomSchema = new Schema({
  name: String,
  game: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Player',
    },
  ],
});

module.exports = model('Room', roomSchema);
