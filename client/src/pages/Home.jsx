function Home(){

    return(
        <>
            <div className="page-title">Real-Time Safety Map<div className="map-head-status">
                <div><div className="map-dot-status" style={{backgroundColor:"rgb(16, 185, 129)"}}></div><span>Safe</span></div> <div><div className="map-dot-status" style={{backgroundColor:" rgb(239, 68, 68)"}}></div><span>Not Safe</span></div> <div><div className="map-dot-status" style={{backgroundColor:"rgb(148, 163, 184)"}}></div><span>Unverified</span></div>
                </div></div>
        </>
    )

}

export default Home