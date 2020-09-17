// const Room = require('../models/Room');
const Player = require('../models/Player');
const Card = require('../models/Card');
const Game = require('../models/Game');
const Room = require('../models/Room');

// Utils
const generateCard = require('../utils/CardUtils');

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

const difference = (arr1, arr2) => arr1.filter((x) => !arr2.includes(x));
const allNumbers = [];
for (let i = 1; i <= 90; i += 1) allNumbers.push(i);

const getNumber = (array) => {
  const diff = difference(allNumbers, array);
  return diff[randomInt(0, diff.length - 1)];
};

exports.getGame = (gameId) => Game.findById(gameId).populate({
  path: 'players',
  populate: {
    path: 'card',
    model: 'Card',
  },
});

exports.markNumber = async (cardId, number, gameId) => {
  const card = await Card.findById(cardId);
  card.slots = card.slots.map((slot) => {
    if (slot.index === number) {
      return {
        ...slot._doc,
        marked: !slot.marked,
      };
    }
    return { ...slot._doc };
  });
  await card.save();
  return Game.findById(gameId).populate({
    path: 'players',
    populate: {
      path: 'card',
      model: 'Card',
    },
  });
};

exports.rollNumber = async (gameId) => {
  const game = await Game.findById(gameId).populate({
    path: 'players',
    populate: {
      path: 'card',
      model: 'Card',
    },
  });
  if (game.numbers.length <= 90) {
    game.numbers.push(getNumber(game.numbers));
    return game.save();
  }
  throw new Error('Game ended');
};

exports.startGame = async (roomId) => {
  const room = await Room.findById(roomId).populate('players');
  if (!room) throw Error('Room not found');

  room.players.forEach(async (player) => {
    const p = await Player.findById(player.id);
    const card = new Card({ slots: generateCard(), owner: p });
    await card.save();
    p.card = card;
    await p.save();
  });

  const game = new Game({
    players: room.players,
    numbers: [],
    status: Game.statuses.NEW,
  });
  room.game = game;
  await room.save();
  return game.save();
};

exports.pauseGame = async (gameId) => {
  const game = await Game.findById(gameId);
  if (!game) throw Error('Game not found');
  game.status = Game.statuses.PAUSED;

  return game.save();
};

exports.gameOver = async (gameId) => {
  const room = await Room.findOne({ gameId }).populate('players');
  if (!room) throw Error('Room not found');
  room.status = Room.statuses.FINISHED;
  return room.save();
};

// exports.getAllRooms = () => {
//   return Room.find().populate("players");
// };

// exports.addPlayer = async (roomId, playerName) => {
//   const room = await Room.findById(roomId).populate("players");
//   const player = new Player({ name: playerName, taken: false });
//   const newPlayer = await player.save();
//   room.players.push(newPlayer);
//   return room.save();
// };

// exports.removePlayer = async (roomId, playerId) => {
//   await Player.findByIdAndDelete(playerId);
//   return Room.findById(roomId).populate("players");
// };
