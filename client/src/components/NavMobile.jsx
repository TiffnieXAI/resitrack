import { Link, useLocation } from "react-router-dom"

function NavMobile(){
    return(
        <div className="navMobile">
            <Link to='/'><div className="navButtMobile">H</div></Link>
            <Link to='/map'><div className="navButtMobile">H</div></Link>
            <Link to='/'><div className="navButtMobile">H</div></Link>
            <Link to='/household'><div className="navButtMobile">H</div></Link>
            <Link to='/incident'><div className="navButtMobile">H</div></Link>
        </div>
    )
}

export default  NavMobile