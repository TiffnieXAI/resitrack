import { Link, useLocation } from "react-router-dom";
import HomeImage from "../assets/Home.png";
import HomeSelectedImage from "../assets/HomeS.png";
import MapImage from "../assets/Map.png";
import MapSelectedImage from "../assets/MapS.png";
import HouseholdImage from "../assets/Household.png";
import HouseholdSelectedImage from "../assets/HouseholdS.png";
import IncidentImage from "../assets/Incident.png";
import IncidentSelectedImage from "../assets/IncidentS.png";

function NavMobile() {
  const location = useLocation();

  return (
    <div className="navMobile">
      <Link to="/home">
        <div className="navButtMobile">
          <img
            src={location.pathname === "/home" ? HomeSelectedImage : HomeImage}
            alt="Home"
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      </Link>
      <Link to="/map">
        <div className="navButtMobile">
          <img
            src={location.pathname === "/map" ? MapSelectedImage : MapImage}
            alt="Map"
            style={{ width: "30px", height: "30px" }}
          />
        </div>
      </Link>
      <Link to="/households">
        <div className="navButtMobile">
          <img
            src={
              location.pathname === "/households"
                ? HouseholdSelectedImage
                : HouseholdImage
            }
            alt="Household"
            style={{ width: "40px", height: "40px" }}
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
            style={{ width: "40px", height: "40px" }}
          />
        </div>
      </Link>
    </div>
  );
}

export default NavMobile;
