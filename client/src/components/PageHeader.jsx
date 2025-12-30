import { useEffect } from "react"
import { useLocation } from "react-router-dom"

function PageHeader() {
  const location = useLocation()

  // This function will run whenever the route changes
  useEffect(() => {
    onRouteChange(location.pathname)
  }, [location.pathname])

  // Handle side effects on route change here
  const onRouteChange = (path) => {
    const householdElement = document.getElementById("household")
    const incidentElement = document.getElementById("incidents")

    // If neither element exists, nothing to do
    if (!householdElement && !incidentElement) return

    if (path === "/households" || path === "/incidents") {
      householdElement?.classList.add("hide-form")
      incidentElement?.classList.add("hide-form")
      
    } else {
     
      
    }
  }

  let NavHeadText = ""
  let NavDescText = ""
  let buttonTitle = ""
  let addButton = null

  if (location.pathname === "/") {
    NavHeadText = "Dashboard"
    NavDescText = "Welcome back, Stan! Here is the summary for today."
  } else if (location.pathname === "/map") {
    NavHeadText = "Safety Map"
    NavDescText = "Shows your live location, helping you stay aware of your surroundings anytime."
  } else if (location.pathname === "/households") {
    NavHeadText = "Register New Household"
    NavDescText = "Displays the list of incidents occurring."
    buttonTitle = "+ Households"
  } else if (location.pathname === "/incidents") {
    NavHeadText = "Incidents"
    NavDescText = "Displays the list of incidents occurring."
    buttonTitle = "+ Incidents"
  }

  const handleAddClick = () => {
    const householdElement = document.getElementById("household")
    householdElement?.classList.remove("hide-form")
    const incidentElement = document.getElementById("incidents")
    incidentElement?.classList.remove("hide-form")
  }

  if (location.pathname === "/households" || location.pathname === "/incidents") {
    addButton = (
      <div className="addButton" onClick={handleAddClick}>
        {buttonTitle}
      </div>
    )
  }

  return (
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
