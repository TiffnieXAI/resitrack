import { Link } from "react-router-dom";

function About(){
    return(<div className="about-container">
       <div className="about-wrapper">
            <div className="about-title">About ResiTrack</div>
            <br></br>
            <div className="about-head">Our Mission</div>
            <div className="about-desc">ResiTrack is a community-driven web-based system designed to save lives and strengthen community resilience during natural disasters. We provide real-time updates on floods, typhoons, and storm surges, delivering timely alerts and evacuation notices to high-risk zones across the Philippines.</div>
            <br></br>
            <div className="about-head">Why ResiTrack?</div>
            <div className="about-desc">The Philippines faces an average of 20 typhoons and storms annually, with about 8 or 9 making landfall. Despite the frequency of these disasters, gaps in disaster preparedness and response persist. Recent events like Typhoon Tino have demonstrated the critical need for better coordination—resulting in significant casualties, displaced families, and widespread infrastructure damage.</div>
            <div className="about-desc">ResiTrack addresses these challenges by solving key problems:</div>
            <ul className="about-list">
                <li><strong>Inefficient resource deployment</strong> — Aid and rescue operations reach those in need faster</li>
                <li><strong>Lack of real-time status</strong> — Live updates on disaster conditions and household safety</li>
                <li><strong>Slow and inaccurate reporting</strong> — Accurate household status information at a glance</li>
                <li><strong>Gaps in safety checks</strong> — Comprehensive monitoring to ensure no one is left behind</li>
            </ul>
            <br></br>
            <div className="about-head">How It Works</div>
            <div className="about-desc">ResiTrack is managed by Local Government Units (LGUs) and allows residents to:</div>
            <ul className="about-list">
                <li>Register their households with location information</li>
                <li>Receive real-time disaster alerts relevant to their area</li>
                <li>Report incidents and hazards as they occur</li>
                <li>View a color-coded safety map showing evacuation status</li>
            </ul>
            <div className="about-desc">Administrators can monitor household data, verify incident reports, and deploy resources with precision using our intuitive dashboard and map visualization system.</div>
            <br></br>
            <div className="about-head">Our Technology</div>
            <div className="about-desc">Built with modern, scalable technology, ResiTrack combines:</div>
            <ul className="about-list">
                <li><strong>Frontend:</strong> React, Vite, and Leaflet mapping for an intuitive user experience</li>
                <li><strong>Backend:</strong> Spring Boot and Java for robust, secure operations</li>
                <li><strong>Database:</strong> MongoDB for flexible data management</li>
                <li><strong>Real-time Communication:</strong> WebSocket technology for instant updates, even with weak internet connections</li>
            </ul>
            <br></br>
            <div className="about-head">Our Commitment</div>
            <div className="about-desc">We believe that every community deserves timely, accurate disaster information. ResiTrack is committed to reducing casualties, saving lives, and helping communities recover faster from natural disasters. By connecting residents, local government units, and emergency services, we're building a more resilient Philippines.</div>
            <Link to="/" className="return">
                Go back
            </Link>
       </div>

    </div>)
}

export default About