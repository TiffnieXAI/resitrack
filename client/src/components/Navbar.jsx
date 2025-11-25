import NavStatus from '../assets/nav-status-icon.png'
import NavIcon from '../assets/icon.png'

function Navbar(){
    return(
        <div className="navbar">
            <div className="left-nav-con">
                <div className="nav-icon">
                    <div className="nav-icon-s">
                        <img src={NavIcon}></img>
                    </div>
                </div>
                <div className="nav-title">
                    <h1>ResiTrack</h1>
                    <p>Disaster Response Management</p>
                </div>
            </div>
            <div className="right-nav-con">
                <div className="nav-active">
                    <div className="nav-active-icon"><img src={NavStatus}></img></div>
                    <div className="nav-active-count">0 Active</div>
                </div>
            </div>
        </div>
    )
}

export default Navbar