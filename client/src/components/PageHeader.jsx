import { useLocation } from "react-router-dom"

function PageHeader(){
    const location = useLocation()
    let NavHeadText = ''
    let NavDescText =''

    if (location.pathname === "/") {
        NavHeadText = "Dashboard";
    } else if (location.pathname === "/map") {
        NavHeadText = "Safety Map";
    } else if (location.pathname === "/households") {
        NavHeadText = "Register New Household";
    } else if (location.pathname === "/incidents") {
       NavHeadText = "Incidents";
    }

    if (location.pathname === "/") {
        NavDescText = "Welcome back, Stan! Here is the summary for today.";
    } else if (location.pathname === "/map") {
        NavDescText = "Shows your live location, helping you stay aware of your surroundings anytime.";
    } else if (location.pathname === "/households") {
    
    } else if (location.pathname === "/incidents") {
        NavDescText = "Displays the list of incidents occurring.";
    }

    return(
        <div className="PageHeader">
            <p>{NavHeadText}</p> 
            <p>{NavDescText}</p>
        </div>
        
    )
}

export default PageHeader