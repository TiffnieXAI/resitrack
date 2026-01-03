import { Link, useLocation } from "react-router-dom"
import Icon from '../assets/darkIcon01t.png'
import Logout from "./Logout";
function NavPage(){
    const location = useLocation();

    if (location.pathname === "/login") {
    return null;
  }

    return(
    <div className="navContainer" id="NavContent" >
        <div className="navTitle">
            <div>
                <img src={Icon} className="navIcon"></img><p>ResiTrack</p><div className="mobileProfileImage"></div>
            </div>
        </div>
        
        <div className="navContent" >
            <div className="navWrapper">
                <div className="navDivider"></div>
                <div className="navProfileWrapper">
                    <div className="navProfile">
                        <div className="profileImage"></div>
                        <div className="profileName">Stan Magallon</div>
                    </div>
                </div>
                <div className="navDivider"></div>
                <div className="navButtonsWrapper">
                    <div className="navButtonsContainer">
                        <Link to='/'><div className="navButton" id={location.pathname === '/'?"navActive":""}><div className="navImage" ></div><p>Dashboard</p></div></Link>
                        <Link to='/map'><div className="navButton" id={location.pathname === '/map'?"navActive":""}><div className="navImage" ></div><p>Safety Map</p></div></Link>
                        <Link to='/households'><div className="navButton" id={location.pathname === '/households'?"navActive":""}><div className="navImage" ></div><p>Households</p></div></Link>
                        <Link to='/incidents'><div className="navButton" id={location.pathname === '/incidents'?"navActive":""}><div className="navImage" ></div><p>Incidents</p></div></Link>
                        
                    </div>
                </div>
                <div className="navDivider"></div>
            </div>
        </div>
        <Logout>Sign out</Logout>
    </div>
    )
}

export default NavPage