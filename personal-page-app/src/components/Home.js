import React, { useEffect } from "react";

import "../styles/Home.css";
import "../styles/App.css";
import CardHolder from "./CardHolder";

import CONTENT from "../HomeContent.json";
const SCROLL_DELAY_MS = 200;
const SCROLL_TIME_MS = 50;

console.log(CONTENT);

function Home(props) {
  let scrollLocations = [];
  let currentLocation = 0;
  let timeLastScrolled = Date.now();
  let animationId = null;
  let throttel = false;

  function moveTo(location) {
    const root = document.getElementById("root");

    let id = animationId;
    clearInterval(id);

    const targetPos = Math.floor(location.offsetTop);
    let pos = Math.floor(root.scrollTop);

    // Calculate scroll distance for a delay of 1ms and SCROLL_TIME_MS time to reach destination
    const distance = Math.abs(targetPos - pos) / SCROLL_TIME_MS;

    id = setInterval(frame, 1);
    animationId = id;
    function frame() {
      if (
        Math.floor(pos) === targetPos ||
        (Math.floor(pos) + distance > targetPos &&
          Math.floor(pos) < targetPos) ||
        (Math.floor(pos) - distance < targetPos && Math.floor(pos) > targetPos)
      ) {
        clearInterval(id);
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

    let array = [root];
    for (let item of locations) array.push(item);

    scrollLocations = array;
  }, []); // Runs once after render

  const handleScroll = (delta) => {
    const timeSinceLastScroll = Math.abs(Date.now() - timeLastScrolled);

    // Dont scroll if its too early to scroll again, then unblock after time
    if (timeSinceLastScroll < SCROLL_DELAY_MS) {
      setTimeout(() => {
        throttel = false;
      }, timeSinceLastScroll);
      return;
    }

    throttel = false;
    timeLastScrolled = Date.now();

    // If scrolling direction is determined, and there is more to scroll in that direction
    // then scroll to the new location and update
    if (delta > 0) {
      // Scrolling down
      if (currentLocation < scrollLocations.length - 1) {
        moveTo(scrollLocations[currentLocation + 1]);
        currentLocation = currentLocation + 1;
      }
    } else if (delta < 0) {
      // Scrolling up
      if (currentLocation > 0) {
        moveTo(scrollLocations[currentLocation - 1]);
        currentLocation = currentLocation - 1;
      }
    }
  };

  // Code largely modeled on: https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  const keys = { 38: 1, 33: 1, 36: 1, 40: 1, 32: 1, 34: 1, 35: 1 };
  const upKeys = { 38: 1, 33: 1, 36: 1 };
  // const downKeys = { 40: 1, 32: 1, 34: 1, 35: 1 };

  function preventDefault(e) {
    if (!throttel) {
      // event throtteling
      throttel = true;

      // Determine scroll direction, attempt to scroll
      var delta = 0;
      if (e.wheelDelta) delta = -e.wheelDelta;
      else if (e.detail) delta = e.detail;
      else if (e.type === "keydown") {
        if (upKeys[e.keyCode]) delta = -5;
        else delta = 5;
      }
      handleScroll(delta);
    }

    e.preventDefault();
  }

  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  // modern Chrome requires { passive: false } when adding event
  var supportsPassive = false;
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: () => {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}

  var wheelOpt = supportsPassive ? { passive: false } : false;
  var wheelEvent =
    "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

  // Disables various methods of scrolling
  function specialScroll() {
    window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
  }

  // Cleans up EventListeners
  function removeSpecialScroll() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener("touchmove", preventDefault, wheelOpt);
    window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
  }

  // Scroll event listener
  useEffect(() => {
    // Scrolls directly to set elements
    specialScroll();

    // Cleanup function
    return () => {
      removeSpecialScroll();
    };
  });

  function getScrollLocations() {
    return CONTENT.scrollLocations.map((location, index) => (
      <div className="ScrollLocation">
        <CardHolder
          key={"Holder-" + index.toString()}
          title={location.title}
          description={location.description}
          cards={location.cards.map((data) => ({
            text: data.title,
            blank: null,
          }))}
        />
      </div>
    ));
  }

  return (
    <div className="Center">
      <p>{CONTENT.mainDescription}</p>
      <div className="LoadingBar"></div>
      {getScrollLocations()}
    </div>
  );
}

export default Home;
