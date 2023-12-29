import React from "react";
import { useWindowDimensions } from "react-native";

import "../styles/Card.css";

function Card({ xPos, yPos, zPos, text }) {
  const cardWidth = getComputedStyle(document.documentElement)
    .getPropertyValue("--card-width")
    .replace(/[^0-9]/gi, "");
  const { height, width } = useWindowDimensions();
  const scrollerWidth =
    (getComputedStyle(document.documentElement)
      .getPropertyValue("--main-content-width")
      .replace(/[^0-9]/gi, "") /
      100) *
    width;

  function calculateDimensions() {
    const scale = 1 - 0.05 * Math.floor(Math.abs(zPos / 2));
    const pos = (xPos / 100) * (scrollerWidth - cardWidth);
    return {
      left: pos.toString() + "px",
      top: yPos.toString() + "px",
      zIndex: zPos.toString(),
      transform: `scale(${scale},${scale})`,
    };
  }

  const style = calculateDimensions();

  return (
    <div className="Card" style={style}>
      <p>{text}</p>
    </div>
  );
}

export default Card;
