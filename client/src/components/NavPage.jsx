import { Link, useLocation } from "react-router-dom";
import Icon from "../assets/darkIcon01t.png";
import HomeImage from "../assets/Home.png";
import HomeSelectedImage from "../assets/HomeS.png";
import MapImage from "../assets/Map.png";
import MapSelectedImage from "../assets/MapS.png";
import HouseholdImage from "../assets/Household.png";
import HouseholdSelectedImage from "../assets/HouseholdS.png";
import IncidentImage from "../assets/Incident.png";
import IncidentSelectedImage from "../assets/IncidentS.png";
import ProfileImage from "../assets/Profile.png";
import Logout from "./Logout";
import { useState, useEffect } from "react";

function NavPage() {
  const location = useLocation();
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    if (user.username) {
      setUsername(user.username);
    }
  }, []);

  // Only hide on login page
  if (location.pathname === "/login" || location.pathname === "/" ) {
    return null;
  }

  return (
    <div className="navContainer" id="NavContent">
      <div className="navTitle">
        <div>
          <img
            src={Icon}
            style={{ width: "50px", height: "50px" }}
            className="navIcon"
          ></img>
          <p>ResiTrack</p>
          <div className="mobileProfileImage"></div>
        </div>
      </div>

      <div className="navContent">
        <div className="navWrapper">
          <div className="navDivider"></div>
          <div className="navProfileWrapper">
            <div className="navProfile">
              <div className="ProfileImage">
                <div>
                  <img
                    src={ProfileImage}
                    alt="Profile Image"
                    style={{ width: "50px", height: "50px" }}
                  ></img>
                </div>
              </div>
              <div className="profileName">{username}</div>
            </div>
          </div>
          <div className="navDivider"></div>
          <div className="navButtonsWrapper">
            <div className="navButtonsContainer">
              <Link to="/home">
                <div
                  className="navButton"
                  id={location.pathname === "/home" ? "navActive" : ""}
                >
                  <div>
                    <img
                      src={
                        location.pathname === "/home"
                          ? HomeSelectedImage
                          : HomeImage
                      }
                      alt="Home"
                      style={{ width: "45px", height: "45px" }}
                    ></img>
                  </div>
                  <p>Dashboard</p>
                </div>
              </Link>
              <Link to="/map">
                <div
                  className="navButton"
                  id={location.pathname === "/map" ? "navActive" : ""}
                >
                  <div>
                    <img
                      src={
                        location.pathname === "/map"
                          ? MapSelectedImage
                          : MapImage
                      }
                      alt="Map"
                      style={{ width: "45px", height: "45px" }}
                    ></img>
                  </div>
                  <p>Safety Map</p>
                </div>
              </Link>
              <Link to="/households">
                <div
                  className="navButton"
                  id={location.pathname === "/households" ? "navActive" : ""}
                >
                  <div>
                    <img
                      src={
                        location.pathname === "/households"
                          ? HouseholdSelectedImage
                          : HouseholdImage
                      }
                      alt="Home"
                      style={{ width: "45px", height: "45px" }}
                    ></img>
                  </div>
                  <p>Households</p>
                </div>
              </Link>
              <Link to="/incidents">
                <div
                  className="navButton"
                  id={location.pathname === "/incidents" ? "navActive" : ""}
                >
                  <div>
                    <img
                      src={
                        location.pathname === "/incidents"
                          ? IncidentSelectedImage
                          : IncidentImage
                      }
                      alt="Home"
                      style={{ width: "45px", height: "45px" }}
                    ></img>
                  </div>
                  <p>Incidents</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="navDivider"></div>
        </div>
      </div>
      <Logout>Sign out</Logout>
    </div>
  );
}

export default NavPage;
