import React, { useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";

import "../styles/Card.css";

function Card({ xPos, yPos, zPos, text }) {
  let cardRef = useRef(null);
  const { height, width } = useWindowDimensions();
  const [style, setStyle] = useState({});

  useEffect(() => {
    function calculateDimensions() {
      let scale = 1 - 0.05 * Math.floor(Math.abs(zPos / 2));
    if (xPos < 50) {
      let pos = xPos;
      if (pos != 0) {
        let centerCardWidth = cardRef.current.clientWidth / 2;
        let scrollerWidth = 0.45 * width;
        let useableWidth = scrollerWidth - centerCardWidth;
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
      if (pos != 0) {
        let centerCardWidth = cardRef.current.clientWidth / 2;
        let scrollerWidth = 0.45 * width;
        let useableWidth = scrollerWidth - centerCardWidth;
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
      setStyle(newStyle);
    } else {
      setStyle(newStyle);
    }
  }, [xPos, yPos, zPos, width]);

  useEffect(() => {});

  return (
    <div className="Card" style={style} ref={cardRef}>
      <p>{text}</p>
    </div>
  );
}

export default Card;
