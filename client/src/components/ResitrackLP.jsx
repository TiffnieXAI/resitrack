import React from "react";
import darkIcon01t from "../assets/darkIcon01t.png";
import LPBackground from "../assets/LPBackground.avif";
import "../index.css";
import { Link } from "react-router-dom";

const ResiTrackLP = (props) => {
  const {
    titleTop = "REVOLUTIONIZING",
    titleBottom = "DISASTER RESPONSE TOGETHER",
    description = "COMBINES TECHNOLOGY AND COMMUNITY DATA TO IMPROVE DISASTER RESPONSE AND RESILIENCE",
    backgroundImage = LPBackground,
    logoText = "ResiTrack",
  } = props;

  return (
    <div
      className="lp-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="lp-overlay"></div>

      <nav className="navbar">
        <div className="logo-container">
          <img src={darkIcon01t} alt="Logo" className="logo-icon" />
          <span className="logo-text">{logoText}</span>
        </div>
      </nav>

      <main className="lp-content">
        <h1 className="lp-title">
          <span className="title-accent">{titleTop}</span>
          <span className="title-main">{titleBottom}</span>
        </h1>
        <p className="lp-description">{description}</p>

        <Link to="/login">
          <button className="logButton">JOIN NOW</button>
        </Link>
      </main>
    </div>
  );
};

export default ResiTrackLP;
