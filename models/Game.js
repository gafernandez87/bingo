const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const gameSchema = new Schema({
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Player',
    },
  ],
  numbers: [Number],
  status: String,
});

const gameModel = model('Game', gameSchema);
gameModel.statuses = {
  NEW: 'NEW',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  FINISHED: 'FINISHED',
};

module.exports = gameModel;
