const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const routes = require('./routes/index');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (_, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});


// Controllers
const RoomController = require('./controllers/Room');
const PlayerController = require('./controllers/Player');
const GameController = require('./controllers/Game');

const server = http.createServer(app);

const io = socketIo(server);

const port = process.env.PORT || 4001;

// Database
mongoose.connect('mongodb://127.0.0.1/bingo', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to DB');
});

io.on('connection', (socket) => {
  const { roomId } = socket.handshake.query;
  const { gameId } = socket.handshake.query;
  let interval;

  if (gameId) {
    GameController.getGame(gameId).then((game) => socket.emit('game', game));
  }

  if (roomId) {
    RoomController.getRoom(roomId).then((room) => {
      socket.emit('room', room);
    });
  }

  // ROOM EVENTS
  socket.on('addPlayer', (params) => {
    RoomController.addPlayer(params.roomId, params.playerName).then((room) => {
      io.emit('room', room);
    });
  });

  socket.on('removePlayer', (params) => {
    RoomController.removePlayer(params.roomId, params.playerId).then((room) => {
      io.emit('room', room);
    });
  });

  socket.on('takePlayer', (params) => {
    PlayerController.takePlayer(params.playerId, true)
      .then(() => RoomController.getRoom(params.roomId))
      .then((room) => io.emit('room', room));
  });

  socket.on('releasePlayer', (params) => {
    PlayerController.takePlayer(params.playerId, false)
      .then(() => RoomController.getRoom(params.roomId))
      .then((room) => io.emit('room', room));
  });
  // ROOM EVENTS

  // GAME EVENTS
  socket.on('startGame', (roomId) => {
    GameController.startGame(roomId).then((room) => io.emit('room', room));
  });

  socket.on('startRolling', (gameId) => {
    interval = setInterval(() => {
      GameController.rollNumber(gameId).then((game) => {
        if (game.numbers.length > 90) {
          GameController.gameOver(game.roomId)
            .then((gameOver) => {
              clearInterval(interval);
              io.emit('gameOver', gameOver);
            });
        } else {
          io.emit('game', game);
        }
      });
    }, 1000);
  });

  socket.on('stopRolling', (roomId) => {
    GameController.pauseGame(roomId).then((room) => {
      clearInterval(interval);
      io.emit('room', room);
    }).catch(console.error);
  });

  socket.on('game', (gameId) => {
    GameController.getGame(gameId).then((game) => socket.emit('game', game));
  });

  socket.on('markNumber', (params) => {
    const { cardId, number, gameId } = params;
    GameController.markNumber(cardId, number, gameId).then((game) => io.emit('game', game));
  });
  // GAME EVENTS

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
