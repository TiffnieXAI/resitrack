import { Link, useLocation } from "react-router-dom";
import HomeImage from "../assets/Home.png";
import HomeSelectedImage from "../assets/HomeS.png";
import MapImage from "../assets/Map.png";
import MapSelectedImage from "../assets/MapS.png";
import HouseholdImage from "../assets/Household.png";
import HouseholdSelectedImage from "../assets/HouseholdS.png";
import IncidentImage from "../assets/Incident.png";
import IncidentSelectedImage from "../assets/IncidentS.png";
import PhoneImage from "../assets/Phone.png";
import PhoneSelectedImage from "../assets/PhoneS.png";

function NavMobile() {
  const location = useLocation();

  if (location.pathname === "/login" || location.pathname === "/" || location.pathname === "/about" ) {
    return null;
  }

  const handleEmergencyCall = () => {
    // Call 911 (Philippines emergency number)
    window.location.href = "tel:911";
  };

  return (
    <div className="navMobile">
      <Link to="/home">
        <div className="navButtMobile">
          <img
            src={location.pathname === "/home" ? HomeSelectedImage : HomeImage}
            alt="Home"
            style={{ width: "6vh", height: "6vh" }}
          />
        </div>
      </Link>
      <Link to="/map">
        <div className="navButtMobile">
          <img
            src={location.pathname === "/map" ? MapSelectedImage : MapImage}
            alt="Map"
            style={{ width: "6vh", height: "6vh" }}
          />
        </div>
      </Link>
    
      <div className="navButtMobile" onClick={handleEmergencyCall} style={{ cursor: "pointer" }}>
        <img
          src={PhoneImage}
          alt="Phone"
          style={{ width: "6vh", height: "6vh" }}
        />
      </div>
  
      <Link to="/households">
        <div className="navButtMobile">
          <img
            src={
              location.pathname === "/households"
                ? HouseholdSelectedImage
                : HouseholdImage
            }
            alt="Household"
            style={{ width: "6vh", height: "6vh" }}
          />
        </div>
      </Link>
      <Link to="/incidents">
        <div className="navButtMobile">
          <img
            src={
              location.pathname === "/incidents"
                ? IncidentSelectedImage
                : IncidentImage
            }
            alt="Incident"
            style={{ width: "6vh", height: "6vh" }}
          />
        </div>
      </Link>
    </div>
  );
}

export default NavMobile;