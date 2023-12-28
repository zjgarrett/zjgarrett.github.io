import React, { useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";

import "../styles/Card.css";

function Card({ xPos, yPos, zPos, text }) {
  let cardRef = useRef(null);
  const { height, width } = useWindowDimensions();
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (xPos < 50) {
      let pos = xPos;
      if (pos != 0) {
        let centerCardWidth = cardRef.current.clientWidth / 2;
        let scrollerWidth = 0.45 * width;
        let useableWidth = scrollerWidth - centerCardWidth;
        pos = useableWidth * (pos / 50);
      }
      setStyle({
        left: pos.toString() + "px",
        top: yPos.toString() + "px",
        zIndex: zPos.toString(),
      });
    } else if (xPos > 50) {
      let pos = 100 - xPos;
      if (pos != 0) {
        let centerCardWidth = cardRef.current.clientWidth / 2;
        let scrollerWidth = 0.45 * width;
        let useableWidth = scrollerWidth - centerCardWidth;
        pos = useableWidth * (pos / 50);
      }
      setStyle({
        right: pos.toString() + "px",
        top: yPos.toString() + "px",
        zIndex: zPos.toString(),
      });
    } else {
      setStyle({
        left: 0,
        right: 0,
        top: yPos.toString() + "px",
        zIndex: zPos.toString(),
      });
    }
  }, [xPos, yPos, zPos, width]);

  return (
    <div className="Card" style={style} ref={cardRef}>
      <p>{text}</p>
    </div>
  );
}

export default Card;
