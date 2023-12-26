import React, {useEffect, useState} from "react";

import {disableScroll, enableScroll} from "../utils/DisableScrolling"

import "../styles/Home.css";
import "../styles/App.css";

const SCROLL_DELAY_MS = 1000;
const SCROLL_TIME_MS = 100;

function Home(props) {
  const [scrollLocations, setScrollLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(0);
  const [lastPostion, setLastPosition] = useState(0);
  const [timeLastScrolled, setTimeLastScrolled] = useState(Date.now());
  const [animationId, setAnimationId] = useState(null);

  function moveTo(location) {
    const root = document.getElementById("root");

    let id = animationId;
    clearInterval(id);

    const targetPos = Math.floor(location.offsetTop);
    let pos = Math.floor(root.scrollTop);
    
    // Calculate scroll distance for a delay of 1ms and SCROLL_TIME_MS time to reach destination
    const distance = Math.abs(targetPos - pos) / SCROLL_TIME_MS;
    console.log(distance);

    id = setInterval(frame, 1);
    setAnimationId(id);
    function frame() {
      if ((Math.floor(pos) === targetPos) ||
          (Math.floor(pos) + distance > targetPos && Math.floor(pos) < targetPos) ||
          (Math.floor(pos) - distance < targetPos && Math.floor(pos) > targetPos)) {
        clearInterval(id);
        enableScroll();
      } else {
        if (pos < targetPos) pos += distance;
        else pos -= distance;
        root.scrollTo(0, pos);
      }
    }
  }

  // Loads the array of scrollLocations
  useEffect(() => {
    const root = document.getElementById("root");
    const locations = document.getElementsByClassName("ScrollLocation");

    let array = [root]
    for (let item of locations) array.push(item);

    setScrollLocations(array)
  }, []); // Runs once after render

  const handleScroll = () => {
    const root = document.getElementById("root");
    const curPosition = root.scrollTop;
    const timeSinceLastScroll = Math.abs(Date.now() - timeLastScrolled);

    if (timeSinceLastScroll < SCROLL_DELAY_MS) return;
    console.log("uhhh")
    setTimeLastScrolled(Date.now());
    if (curPosition > lastPostion) {
      // Scrolling down
      if (currentLocation < scrollLocations.length - 1) {
        disableScroll();
        moveTo(scrollLocations[currentLocation + 1]);
        setCurrentLocation(currentLocation + 1);
      }
    } else if (curPosition < lastPostion) {
      // Scrolling up
      if (currentLocation > 0) {
        disableScroll();
        moveTo(scrollLocations[currentLocation - 1]);
        setCurrentLocation(currentLocation - 1);
      }
    }

    setLastPosition(curPosition);
  };


  // Scroll event listener
  useEffect(() => {
    const root = document.getElementById("root");

    // Call updateBackground on scroll
    root.addEventListener("scroll", handleScroll);
  
    // Cleanup function
    return () => {
      root.removeEventListener("scroll", handleScroll);
    };
  }, [scrollLocations, currentLocation, lastPostion, timeLastScrolled, animationId]);
  

  return (
    <div className="Center">
      <p>This page is still WIP, comeback soon!</p>
      <p>Meanwhile, please be pleasantly distracted by this animated bar.</p>
      <div className="LoadingBar"></div>
      <div className="ScrollLocation">
        <p>First place to scroll to</p>
      </div>
      <div className="ScrollLocation">
        <p>Second place to scroll to</p>
      </div>
      <div className="ScrollLocation">
        <p>Last place to scroll to</p>
      </div>
    </div>
  );
}

export default Home