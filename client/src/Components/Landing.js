import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// Utils
import apiCall from "../utils/apiCall";

// Styles
import styles from "./Landing.module.css";

const Landing = () => {
  const [roomName, setRoomName] = useState("");
  const history = useHistory();

  const createRoom = () => {
    apiCall("http://localhost:4001/api/rooms", {
      method: "POST",
      body: JSON.stringify({ roomName: roomName }),
    })
      .then((response) => {
        history.push(`/room/${response._id}`);
      })
      .catch((err) => {
        console.log("Error while creating room", err);
      });
  };

  return (
    <div className={styles.landing}>
      <h2 className={styles.title}>Bienvenido al Bingo!</h2>
      <section className={styles.newRoom}>
        <p className={styles.subtitle}>Crea una sala para empezar</p>
        <label className={styles.roomName}>NOMBRE</label>
        <input
          type="text"
          className={styles.input}
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className={styles.button} onClick={createRoom}>
          CREAR
        </button>
      </section>
    </div>
  );
};

export default Landing;
