import React, { useState } from "react";
import styles from "./Card.module.css";

import garabato from "./garabato2.png";

const Card = ({ slots, markNumber }) => {
  const [cardSize] = useState(50);

  const handleClick = (number) => {
    if (number === null) return;
    markNumber(number);
  };

  const renderSlot = (slot) => {
    return (
      <>
        {slot.marked ? (
          <img src={garabato} className={styles.markedNumber} />
        ) : null}
        {slot.number}
      </>
    );
  };

  return (
    <div
      className={styles.card}
      style={{
        width: `${(Number(cardSize) + 2) * 9}px`,
        height: `${Number(cardSize) * 3 + 6}px`,
      }}
    >
      {slots.map((slot) => {
        const slotClasses = [
          styles.cell,
          slot.number === null ? styles.empty : null,
        ].join(" ");
        return (
          <div
            key={slot.index}
            className={slotClasses}
            style={{
              height: `${cardSize}px`,
              lineHeight: `${cardSize}px`,
              width: `${cardSize}px`,
            }}
            onClick={() => handleClick(slot.number)}
          >
            {renderSlot(slot)}
          </div>
        );
      })}
    </div>
  );
};

export default Card;
