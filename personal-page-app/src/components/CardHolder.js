import React, { useState } from "react";

import { Card, JobCard, ProjectCard } from "./Card";
import { useInterval } from "../utils/useInterval";

import "../styles/Card.css";

const AUTO_ROTATE_MS = 2000;

function CardHolder({ title, description, cards }) {
  const [currentFocus, setFocus] = useState(0); // Index of the card that should be focused, on top
  const [incrementUp, setDirection] = useState(true); // The direction the automatic focus change will go
  const [allowAuto, setAllowAuto] = useState(true); // If auto changing focus is enabled
  const [manualChange, setManualChange] = useState(false); // If manual changing the focus is enabled

  // Set up the interval to automatically switch the focused Card
  useInterval(
    () => {
      let moveUp = incrementUp;
      if (currentFocus === cards.length - 1) moveUp = false;
      else if (currentFocus === 0) moveUp = true;

      if (moveUp) {
        setFocus((currentFocus) => currentFocus + 1);
      } else {
        setFocus((currentFocus) => currentFocus - 1);
      }
      setDirection(moveUp);
    },
    allowAuto ? AUTO_ROTATE_MS : null // null disables interval
  );

  // Builds the list of cards to be displayed, along with their positioning information
  function buildCards() {
    const xLeftStepSize = 50 / currentFocus;
    const xRightStepSize = 50 / (cards.length - currentFocus - 1);

    const result = [];
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];

      // Calculate the positioning information
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

      // Build the inner component that contains all the styling rules
      let innerComp;
      if (card.type === "JobCard") {
        innerComp = (
          <JobCard
            company={card.company}
            title={card.title}
            description={card.description}
            skills={card.skills}
            urls={card.urls}
          />
        );
      } else if (card.type === "ProjectCard") {
        innerComp = (
          <ProjectCard
            title={card.title}
            description={card.description}
            skills={card.skills}
            urls={card.urls}
          />
        );
      }

      result.push(
        <Card
          key={"Card-" + i.toString()}
          xPos={x}
          yPos={y}
          zPos={z}
          innerComp={innerComp}
        />
      );
    }
    return result;
  }

  // Enable/Disable automatically changing which Card is focused
  function onEnter() {
    setAllowAuto(false);
  }
  function onExit() {
    setAllowAuto(true);
    setManualChange(false);
  }

  // Manually change focused card on click and horizontal movement
  let movementSum = 0;
  function manualMove(event) {
    if (manualChange) {
      movementSum += event.movementX;
      if (movementSum >= 200) {
        if (currentFocus > 0) setFocus(currentFocus - 1);
      } else if (movementSum < -200) {
        if (currentFocus < cards.length - 1) setFocus(currentFocus + 1);
      }
    }
  }

  // Enable/disable the above event listener
  function enableScrollingCards() {
    setManualChange(true);
  }
  function disableScrollingCards() {
    setManualChange(false);
  }

  return (
    <div
      className="CardHolder"
      onMouseEnter={onEnter}
      onMouseLeave={onExit}
      onMouseDown={enableScrollingCards}
      onMouseUp={disableScrollingCards}
      onMouseMove={manualMove}
    >
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="CardScroller">{buildCards()}</div>
    </div>
  );
}

export default CardHolder;
