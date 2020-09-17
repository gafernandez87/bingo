import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import socketIOClient from "socket.io-client";

//Components
import Card from "./Card";
import TableNumbers from "./TableNumbers";

//Style
import styles from "./Game.module.css";

const ENDPOINT = "http://127.0.0.1:4001";
let socket;

const Game = () => {
  const { gameId } = useParams();
  const [player, setPlayer] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [rolling, setRolling] = useState(false);
  const [cookies] = useCookies(["bingo-session-id"]);

  const sessionId = cookies["bingo-session-id"];
  useEffect(() => {
    socket = socketIOClient(ENDPOINT, {
      query: { gameId: gameId },
    });

    socket.on("game", (game) => {
      if (game) {
        console.log(game);
        const player = game.players.find((player) => player._id === sessionId);
        setPlayer(player);
        setNumbers(game.numbers);
      }
    });
    socket.on("gameOver", (game) => {
      alert("GAME OVER");
    });
  }, []);

  const startRolling = () => {
    socket.emit("startRolling", gameId);
    setRolling(true);
  }

  const stopRolling = () => {
    socket.emit("stopRolling");
    setRolling(false);
  }

  const markNumber = (number) => {
    socket.emit("markNumber", {
      cardId: player.card._id,
      number: number,
      gameId: gameId,
    });
  };

  if (!player) return <div>Loading</div>;

  return (
    <div className={styles.game}>
      <section className={styles.left}>
        <div className={styles.lastNumbers}>
          <h4>Ultimos números</h4>
          <ul>
            {numbers.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
        <div className={styles.allNumbers}>
          {rolling ? <button onClick={stopRolling}>Detener bolillero</button> :
            <button onClick={startRolling}>Comenzar bolillero</button>}
          <TableNumbers doneNumbers={numbers} />
        </div>
      </section>
      <section className={styles.right}>
        <Card slots={player.card.slots} markNumber={markNumber} />
      </section>
    </div>
  );
};

export default Game;
