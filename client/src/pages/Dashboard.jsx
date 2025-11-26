import Imagess from "../components/Images.jsx";

function Dashboard(){

    return(
        <>
            <div className="page-title">Response Metrics<div className="create-butt"><span>╋ </span> Create Incident</div></div>
            <div className="dashboard-card-container">
                <div className="dashboard-cards"><div className="dash-card-icon" style={{backgroundColor:"rgb(59, 130, 246)"}}><img src={Imagess.dashboardPage.TotalHouseHold}></img></div><div className="dash-card-contents">Total Households<span>0</span></div></div>
                <div className="dashboard-cards"><div className="dash-card-icon" style={{backgroundColor:"rgb(16, 185, 129)"}}><img src={Imagess.dashboardPage.SafeHouseHold}></img></div><div className="dash-card-contents">Total Households<span>0</span></div></div>
                <div className="dashboard-cards"><div className="dash-card-icon" style={{backgroundColor:"rgb(239, 68, 68)"}}><img src={Imagess.dashboardPage.notSafe}></img></div><div className="dash-card-contents">Total Households<span>0</span></div></div>
                <div className="dashboard-cards"><div className="dash-card-icon" style={{backgroundColor:"rgb(148, 163, 184)"}}><img src={Imagess.dashboardPage.UnverifiedDash}></img></div><div className="dash-card-contents">Total Households<span>0</span></div></div>
                <div className="dashboard-cards"><div className="dash-card-contents" id="safetyPercentage">Total Households<span>0</span></div></div>
            </div>
        </>
    )

}

export default Dashboard

