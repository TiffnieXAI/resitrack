import CurrentLocationMap from "../components/CurrentLocationMap"
import PageHeader from "../components/PageHeader"
function Home(){

    return(
        <div className="content-wrapper">
            <PageHeader></PageHeader>
            <div className="summary-container">
                <div className="summary-bar summary-line">
                    <div className="summary-bar-desc">
                        <div>
                            <p>Households</p>
                            <p>{"10"}</p>
                        </div>
                    </div>
                    <div className="summary-bar-desc">
                        <div>
                            <p>Safe</p>
                            <p>{"10"}</p>
                        </div>
                    </div>
                    <div className="summary-bar-desc">
                        <div>
                            <p>Danger</p>
                            <p>{"10"}</p>
                        </div>
                        
                    </div>
                    <div className="summary-bar-desc">
                        <div>
                            <p>Unverified</p>
                            <p>{"10"}</p>
                        </div>
                    </div>
                </div>
                <div className="summary-bar smaller-bar">
                    <div className="summary-bar-desc">
                        <div>
                            <p>Safety Percentage</p>
                            <p>{"10%"}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="active-incident-container">
                <div className="page-sub-header">Active Incident</div>
            </div>
        </div>
    )

}

export default Home