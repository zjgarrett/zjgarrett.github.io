import Card from "./Card";
import React, { useState } from "react";

import "../styles/Card.css";

function CardHolder({ title, description, cards }) {
  const [currentFocus, setFocus] = useState(0); // Index of the card that should be focused, on top

  function buildCards() {
    const xLeftStepSize = 50 / currentFocus;
    const xRightStepSize = 50 / (cards.length - currentFocus - 1);
    const result = [];
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      let x = 50;
      let y = 0;
      let z = 0;
      if (i < currentFocus) {
        x = xLeftStepSize * i;
        y = (currentFocus - i) * 10;
        z = -2 * (currentFocus - i) - 1;
      } else if (i > currentFocus) {
        x = 50 + xRightStepSize * (i - currentFocus);
        z = -2 * (i - currentFocus);
        y = (i - currentFocus) * 10;
      }
      result.push(
        <Card
          key={"Card-" + i.toString()}
          xPos={x}
          yPos={y}
          zPos={z}
          text={card.text}
        />
      );
    }
    return result;
  }

  return (
    <div className="CardHolder">
      <h2>{title}</h2>
      <p>{description}</p>
      <div
        className="col"
        style={{
          display: "flex",
          flexDirection: "row",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        <button
          onClick={() => {
            setFocus(currentFocus - 1);
          }}
        >
          Move focus left
        </button>
        <button
          onClick={() => {
            setFocus(currentFocus + 1);
          }}
        >
          Move focus right
        </button>
      </div>
      <div className="CardScroller">{buildCards()}</div>
    </div>
  );
}

export default CardHolder;
