import { useLocation } from "react-router-dom"

function PageHeader(){
    const location = useLocation()
    let NavHeadText = ''
    let NavDescText =''
    let buttonAdd = ''
    let buttonTitle = ''
    let addButton = ''

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
        NavDescText = "Displays the list of incidents occurring.";
        buttonAdd = ''
        buttonTitle = '+ Households'
    } else if (location.pathname === "/incidents") {
        NavDescText = "Displays the list of incidents occurring.";
        buttonAdd = ''
        buttonTitle = '+ Incidents'
    }

    if(location.pathname === '/households' || location.pathname === '/incidents'){
        addButton = <div className="addButton">{buttonTitle}</div>
    }else {
       
    }
    

    return(
        <div className="pageHeaderWrap">
            <div className="PageHeader">
                <p>{NavHeadText}</p> 
                <p>{NavDescText}</p>
            </div>
            {addButton}
        </div>  
    )
}

export default PageHeader