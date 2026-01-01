import { Link, useLocation } from "react-router-dom"

function NavMobile(){
    return(
        <div className="navMobile">
            <Link to='/'><div className="navButtMobile">H</div></Link>
            <Link to='/map'><div className="navButtMobile">H</div></Link>
            <Link to='/'><div className="navButtMobile">H</div></Link>
            <Link to='/households'><div className="navButtMobile">H</div></Link>
            <Link to='/incidents'><div className="navButtMobile">H</div></Link>
        </div>
    )
}

export default  NavMobile