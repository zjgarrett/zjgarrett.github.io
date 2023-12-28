import Card from "./Card";
import React from "react";
import { useWindowDimensions } from "react-native";

import "../styles/Card.css";

function CardHolder({ title, description, cards }) {
  let currentFocus = 2; // Index of the card that should be focused, on top
  const { height, width } = useWindowDimensions();

  function buildCards() {
    const useableWidth = width;
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
        z = -1 * (currentFocus - i) - 1;
      } else if (i > currentFocus) {
        x = 50 + xRightStepSize * (i - currentFocus);
        z = -1 * (i - currentFocus);
        y = (i - currentFocus) * 10;
      }
      result.push(<Card xPos={x} yPos={y} zPos={z} text={card.text} />);
    }
    return result;
  }

  return (
    <div className="CardHolder">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="CardScroller">{buildCards()}</div>
    </div>
  );
}

export default CardHolder;
