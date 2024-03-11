import React, { useState } from "react";

import "../styles/Header.css";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";

function Header(props) {
  const [sidebarVisibility, setSidebarVisibility] = useState(false);

  const toggleSidebar = () => {
    if (sidebarVisibility) {
      hideSidebar();
    } else {
      showSidebar();
    }
    setSidebarVisibility(!sidebarVisibility);
  };

  const hideSidebar = () => {
    const sidebar = document.getElementById("SidebarNavigation");
    let rules = {
      transform: "rotateY(-90deg) skewX(-5deg)",
    };
    const animation = sidebar.animate(rules, 600);
    animation.onfinish = () => {
      sidebar.style.transform = "rotateY(90deg) skewX(5deg)";
    };
  };

  const showSidebar = () => {
    const sidebar = document.getElementById("SidebarNavigation");
    let rules = {
      transform: "rotateY(0deg) skewX(0deg)",
    };
    const animation = sidebar.animate(rules, 600);
    animation.onfinish = () => {
      sidebar.style.transform = "rotateY(0deg) skewX(0deg)";
    };
  };

  return (
    <div className={"HeaderLayout"}>
      <div className={"HeaderFlex"}>
        <h1 className="" onClick={toggleSidebar}>
          Zachary Garrett
        </h1>
        {/* <div className={"HeaderSidebarButton"} onClick={toggleSidebar}>
          <DensityMediumIcon />
        </div> */}
      </div>
      <div id={"SidebarNavigation"} onMouseLeave={toggleSidebar}>
        <div>
          <p>Text 1</p>
        </div>
        <div>
          <p>Text 2 Text 2 Text 2 Text 2</p>
        </div>
        <div>
          <p>Text 3</p>
        </div>
        <div>
          <p>
            Hey now, I <i>did</i> say it was WIP
          </p>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default Header;
