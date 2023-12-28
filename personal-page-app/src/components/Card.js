import React, { useEffect, useRef, useState } from "react";
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
  const useableWidth = scrollerWidth / 2 - cardWidth / 2;
  let style = {};

    function calculateDimensions() {
      let scale = 1 - 0.05 * Math.floor(Math.abs(zPos / 2));
    if (xPos < 50) {
      let pos = xPos;
      if (pos !== 0) {
        pos = useableWidth * (pos / 50);
      }
        return {
        left: pos.toString() + "px",
        top: yPos.toString() + "px",
        zIndex: zPos.toString(),
          transform: `scale(${scale},${scale})`,
        };
    } else if (xPos > 50) {
      let pos = 100 - xPos;
      if (pos !== 0) {
        pos = useableWidth * (pos / 50);
      }
        return {
        right: pos.toString() + "px",
        top: yPos.toString() + "px",
        zIndex: zPos.toString(),
          transform: `scale(${scale},${scale})`,
        };
    } else {
        return {
        left: 0,
        right: 0,
        top: yPos.toString() + "px",
        zIndex: zPos.toString(),
        };
      }
    }

    const newStyle = calculateDimensions();
    if (Object.keys(style).length === 0) {
    style = newStyle;
    } else {
    style = newStyle;
    }

  return (
    <div className="Card" style={style}>
      <p>{text}</p>
    </div>
  );
}

export default Card;
