import React, { useEffect, useState, useRef } from "react";

import "../styles/Home.css";
import "../styles/App.css";
import CardHolder from "./CardHolder";

import CONTENT from "../HomeContent.json";
const SCROLL_DELAY_MS = 200;
const SCROLL_TIME_MS = 50;
const SCROLL_TREASHOLD = 100;

function Home(props) {
  let contentRef = useRef();
  let scrollLocations = [];
  let currentLocation = 0;
  let currentOffsetY = 0;
  let timeLastScrolled = Date.now();
  let animationId = null;
  let throttel = false;
  const defaultClass = "Center";
  let currentClasses = defaultClass;

  function moveTo(location) {
    const root = document.getElementById("root");

    let id = animationId;
    clearInterval(id);

    const targetPos = Math.floor(location.getBoundingClientRect().top);
    let pos = currentOffsetY;
    currentOffsetY = currentOffsetY + targetPos;

    // Calculate scroll distance for a delay of 1ms and SCROLL_TIME_MS time to reach destination
    const distance = Math.abs(targetPos) / SCROLL_TIME_MS;

    id = setInterval(frame, 1);
    animationId = id;
    function frame() {
      if (
        Math.floor(pos) === currentOffsetY ||
        (Math.floor(pos) + distance > currentOffsetY &&
          Math.floor(pos) < currentOffsetY) ||
        (Math.floor(pos) - distance < currentClasses &&
          Math.floor(pos) > targetPos)
      ) {
        clearInterval(id);
      } else {
        if (pos < currentOffsetY) pos += distance;
        else pos -= distance;
        root.scrollTo(0, pos);
      }
    }
  }

  // Loads the array of scrollLocations
  useEffect(() => {
    const conatiner = document.getElementById("container");
    const locations = document.getElementsByClassName("ScrollLocation");

    let array = [conatiner];
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
        currentLocation = currentLocation + 1;
        moveTo(scrollLocations[currentLocation]);
        if (currentLocation === 1) {
          currentClasses = currentClasses + " backdrop";
          contentRef.current.className = currentClasses;
        }
      }
    } else if (delta < 0) {
      // Scrolling up
      if (currentLocation > 0) {
        currentLocation = currentLocation - 1;
        moveTo(scrollLocations[currentLocation]);
        if (currentLocation === 0) {
          currentClasses = defaultClass;
          contentRef.current.className = currentClasses;
        }
      }
    }
  };

  // Code largely modeled on: https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  const keys = { 38: 1, 33: 1, 36: 1, 40: 1, 32: 1, 34: 1, 35: 1 };
  const upKeys = { 38: 1, 33: 1, 36: 1 };
  // const downKeys = { 40: 1, 32: 1, 34: 1, 35: 1 };

  let touchLast = null;
  let movementTotal = 0;
  function preventDefault(e) {
    e.preventDefault();

    if (!throttel) {
      // event throtteling
      // Determine scroll direction, attempt to scroll
      var delta = 0;
      if (e.wheelDelta) delta = -e.wheelDelta;
      else if (e.detail) delta = e.detail;
      else if (e.type === "keydown") {
        if (upKeys[e.keyCode]) delta = -100;
        else delta = 100;
      } else {
        if (!touchLast) touchLast = e.changedTouches[0].clientY;
        else {
          delta = touchLast - e.changedTouches[0].clientY;
          touchLast = e.changedTouches[0].clientY;
        }
      }

      movementTotal += delta;
      console.log(movementTotal);
      if (Math.abs(movementTotal) >= SCROLL_TREASHOLD) {
        touchLast = null;
        throttel = true;
        handleScroll(movementTotal);
        movementTotal = 0;
      }
    }
  }

  // Clears last location of touch scroll tracker
  function clearTouchLast(e) {
    touchLast = null;
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
    window.addEventListener("touchend", clearTouchLast, wheelOpt); // clear last location on end of touch
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
  }

  // Cleans up EventListeners
  function removeSpecialScroll() {
    window.removeEventListener("DOMMouseScroll", preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener("touchmove", preventDefault, wheelOpt);
    window.removeEventListener("touchend", clearTouchLast, wheelOpt);
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
      <div className="ScrollLocation popped" key={"Holder-" + index.toString()}>
        <CardHolder
          title={location.title}
          description={location.description}
          cards={location.cards}
        />
      </div>
    ));
  }

  return (
    <div className={defaultClass} ref={contentRef}>
      <p className="popped">{CONTENT.mainDescription}</p>
      {/* <div className="LoadingBar"></div> */}
      {getScrollLocations()}
    </div>
  );
}

export default Home;
