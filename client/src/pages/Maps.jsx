import PageHeader from "../components/PageHeader"
import CurrentLocationMap from "../components/CurrentLocationMap"
function Maps(){
    return(
        <div className="content-wrapper">
            <PageHeader></PageHeader>
            <CurrentLocationMap className="maps"></CurrentLocationMap>
        </div>
        
    )
}

export default Maps