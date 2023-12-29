import React from "react";
import { useWindowDimensions } from "react-native";

import "../styles/Card.css";

export function Card({ xPos, yPos, zPos, innerComp }) {
  const cardWidth = getComputedStyle(document.documentElement)
    .getPropertyValue("--card-width")
    .replace(/[^0-9]/gi, "");
  const { width } = useWindowDimensions();
  const scrollerWidth =
    (getComputedStyle(document.documentElement)
      .getPropertyValue("--main-content-width")
      .replace(/[^0-9]/gi, "") /
      100) *
    width;

  function calculateDimensions() {
    const scale = 1 - 0.05 * Math.floor(Math.abs(zPos / 2));
    const blur = 2 * Math.floor(Math.abs(zPos / 2));
    const pos = (xPos / 100) * (scrollerWidth - cardWidth);
    return {
      left: pos.toString() + "px",
      top: yPos.toString() + "px",
      zIndex: zPos.toString(),
      filter: `blur(${blur}px)`,
      transform: `scale(${scale},${scale})`,
    };
  }

  const style = calculateDimensions();

  return (
    <div className="Card" style={style}>
      {innerComp}
    </div>
  );
}

export function JobCard({ company, title, description, skills, urls }) {
  return (
    <div>
      <h2>{company}</h2>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function ProjectCard({ title, description, skills, urls }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
