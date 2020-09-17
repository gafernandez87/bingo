const express = require('express');

const Player = require('../models/Player');

const RoomController = require('../controllers/Room');
const GameController = require('../controllers/Game');

const router = express.Router();

router.get('/', (_, res) => {
  res.status(200).send({ response: 'I am alive' });
});

router.get('/rooms/:roomId', async (req, res) => {
  RoomController.getRoom(req.params.roomId)
    .then((room) => {
      if (room) {
        res.status(200).json(room);
      }
      res.status(404).json({ error: 'room not found' });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get('/rooms', async (req, res) => {
  RoomController.getAllRooms()
    .then((allRooms) => {
      res.status(200).json(allRooms);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/rooms', (req, res) => {
  RoomController.createRoom(req.body.name)
    .then((newRoom) => {
      res.status(200).json(newRoom);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get('/test/:roomId', async (req, res) => {
  try {
    const game = await GameController.pauseGame(req.params.roomId);
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/rooms/:roomId/players', async (req, res) => {
  const room = await RoomController.getRoom(req.params.roomId);
  if (room) {
    const player = new Player({ name: req.body.name, taken: false });
    player.save((err, newPlayer) => {
      if (err) {
        res.status(500).json({ error: 'Error while adding player to room' });
      }
      room.players.push(newPlayer);
      room.save((err, updatedRoom) => {
        if (err) {
          res.status(500).json(err);
        }
        res.status(200).json(updatedRoom);
      });
    });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

router.delete('/rooms/:roomId/players/:playerId', async (req, res) => {
  const room = await RoomController.getRoom(req.params.roomId);
  if (room) {
    room.players = room.players.filter(
      (player) => player._id.toString() !== req.params.playerId,
    );
    room.save((err, updatedRoom) => {
      if (err) {
        res.status(500).json(err);
      }
      res.status(200).json(updatedRoom);
    });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

router.post('/rooms/:roomId/players/:playerId/take', async (req, res) => {
  const room = await RoomController.getRoom(req.params.roomId);
  if (room) {
    const player = await Player.findById(req.params.playerId);
    if (player) {
      player.taken = req.body.taken;
      player.save((err, updatedPlayer) => {
        if (err) {
          res.status(500).json(err);
        }
        res.status(200).json(updatedPlayer);
      });
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

module.exports = router;
