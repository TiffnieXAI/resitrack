import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

function PageNav(){

    const location = useLocation()


    

    return(
        <div className="page-nav">
            <div className="nav-wrapper">
                <Link className="page-nav-butt" to="/" id={location.pathname ==='/'?"active":""} ><span>Safety Map</span></Link>
                <Link className="page-nav-butt" to="/dashboard" id={location.pathname ==='/dashboard'?"active":""}><span>Dashboard</span></Link>
                <Link className="page-nav-butt" to="/household" id={location.pathname ==='/household'?"active":""}><span>Households</span></Link>
                <Link className="page-nav-butt" to="/incident" id={location.pathname ==='/incident'?"active":""}><span>Incidents</span></Link>
            </div>
        </div>
    )

}

export default PageNav