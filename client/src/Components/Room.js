import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import socketIOClient from "socket.io-client";
import { useHistory } from "react-router-dom";

// Styles
import styles from "./Room.module.css";

const ENDPOINT = "http://127.0.0.1:4001";
let socket;

const Room = () => {
  const [room, setRoom] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const { roomId } = useParams();
  const [cookies, setCookie] = useCookies(["bingo-session-id"]);
  const history = useHistory();

  useEffect(() => {
    if (room && room.game) {
      console.log(room);
      history.push(`/game/${room.game}`);
    }
  }, [room]);
  useEffect(() => {
    socket = socketIOClient(ENDPOINT, {
      query: { roomId: roomId },
    });

    socket.on("room", (room) => {
      setRoom(room);
    });
  }, []);

  const addPlayer = () => {
    socket.emit("addPlayer", { roomId: roomId, playerName: playerName });
    setPlayerName("");
  };

  const takePlayer = (playerId) => {
    callSocket("takePlayer", { roomId: roomId, playerId: playerId });
    setCookie("bingo-session-id", playerId);
  };

  const releasePlayer = (playerId) => {
    callSocket("releasePlayer", { roomId: roomId, playerId: playerId });
    setCookie("bingo-session-id", null);
  };

  const callSocket = (action, params) => {
    socket.emit(action, params);
  };

  const renderButtons = (playerId, taken) => {
    const sessionId = cookies["bingo-session-id"];

    if (taken) {
      if (sessionId === playerId) {
        return (
          <button
            onClick={() => releasePlayer(playerId)}
            className={styles.release}
          >
            Liberar
          </button>
        );
      } else {
        return null;
      }
    } else {
      return (
        <button onClick={() => takePlayer(playerId)} className={styles.use}>
          USAR
        </button>
      );
    }
  };

  if (room) {
    return (
      <div className={styles.room}>
        <section className={styles.left}>
          <p className={styles.title}>
            Sala <b>"{room.name}"</b>
          </p>
          <section className={styles.share}>
            <input
              type="text"
              defaultValue={`http://localhost:4001/room/${roomId}`}
            />
            <p className={styles.pre}>
              Compartí este link a las personas invitadas al Bingo
            </p>
          </section>
          <section className={styles.addPlayer}>
            <p>Agrega a las personas que van a jugar</p>
            <label>Nombre</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={addPlayer}>AGREGAR</button>
          </section>
        </section>
        <section className={styles.right}>
          <h2>Participantes ({room.players.length})</h2>
          <ul className={styles.players}>
            {room.players.map((player) => {
              return (
                <li key={player._id}>
                  {player.name}
                  <div className={styles.buttons}>
                    {renderButtons(player._id, player.taken)}
                    <button
                      onClick={() =>
                        callSocket("removePlayer", {
                          roomId: roomId,
                          playerId: player._id,
                        })
                      }
                      className={styles.remove}
                    >
                      BORRAR
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <button onClick={() => callSocket("startGame", roomId)}>
            START GAME
          </button>
        </section>
      </div>
    );
  }

  return <div>Loading</div>;
};

export default Room;
