const Room = require('../models/Room');
const Player = require('../models/Player');

exports.createRoom = (roomName) => {
  const room = new Room({ name: roomName });
  return room.save();
};

exports.getRoom = (roomId) => Room.findById(roomId).populate('players');

exports.getAllRooms = () => Room.find().populate('players');

exports.addPlayer = async (roomId, playerName) => {
  const room = await Room.findById(roomId).populate('players');
  const player = new Player({ name: playerName, taken: false });
  const newPlayer = await player.save();
  room.players.push(newPlayer);
  return room.save();
};

exports.removePlayer = async (roomId, playerId) => {
  await Player.findByIdAndDelete(playerId);
  return Room.findById(roomId).populate('players');
};
