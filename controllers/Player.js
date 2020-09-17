const Player = require('../models/Player');

exports.takePlayer = async (playerId, taken) => {
  const player = await Player.findById(playerId);
  player.taken = taken;
  return player.save();
};
