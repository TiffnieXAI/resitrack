import { useLocation } from "react-router-dom"

function Login(){

    return(<>
        <div className="login-container">
            <div className="nav-title">
                <h1>ResiTrack</h1>
            </div>
            <div className="login-box">
                <div className="login-wrapper">
                    <div className="login-bar">
                        <p>username</p>
                        <input type="text"></input>
                    </div>
                    <div className="login-bar">
                        <p>password</p>
                        <input type="password"></input>
                        <div>forgot password</div>
                    </div>
                    <div className="SignIn-butt">Sign in</div>
                    </div>
            </div>
        </div>
        
    </>)    

}

export default Login