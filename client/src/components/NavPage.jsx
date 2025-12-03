import { Link, useLocation } from "react-router-dom"
import Icon from '../assets/Icon.png'

function NavPage(){
    const location = useLocation();

    return(
    <div className="navContainer">
        <div className="navTitle">
            <div>
                <img src={Icon} className="navIcon"></img><p>ResiTrack</p>
            </div>
        </div>
        
        <div className="navContent">
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
    </div>
    )
}

export default NavPage