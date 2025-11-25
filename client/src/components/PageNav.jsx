import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

import Imagess from "./Images";

function PageNav(){

    const location = useLocation()


    

    return(

        <div className="page-nav">
            <div className="nav-wrapper">
                <Link className="page-nav-butt" to="/" id={location.pathname ==='/'?"active":""} ><img className="navImage" src={location.pathname === '/' ? Imagess.pagesNav.LocationActive : Imagess.pagesNav.Location} ></img><span>Safety Map</span></Link>
                <Link className="page-nav-butt" to="/dashboard" id={location.pathname ==='/dashboard'?"active":""} ><img className="navImage" src={location.pathname === '/dashboard' ? Imagess.pagesNav.PulseActive : Imagess.pagesNav.Pulse}></img><span>Dashboard</span></Link>
                <Link className="page-nav-butt" to="/household" id={location.pathname ==='/household'?"active":""}><img className="navImage" src={location.pathname === '/household' ? Imagess.pagesNav.houseHoldActive : Imagess.pagesNav.houseHold}></img><span>Households</span></Link>
                <Link className="page-nav-butt" to="/incident" id={location.pathname ==='/incident'?"active":""}><img className="navImage" src={location.pathname === '/incident' ? Imagess.pagesNav.IncidentActive : Imagess.pagesNav.Incident}></img><span>Incidents</span></Link>
            </div>
        </div>
    )

}

export default PageNav