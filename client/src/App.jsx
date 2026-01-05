import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NavPage from "./components/NavPage.jsx";
import NavMobile from "./components/NavMobile.jsx";
import Maps from "./pages/Maps.jsx";
import Incidents from "./pages/Incidents.jsx";
import Households from "./pages/Households.jsx";
import Login from "./pages/Login.jsx";
import AuthGuard from "./components/AuthGuard.jsx";
import ResitrackLandingPage from "./pages/ResitrackLandingPage.jsx";
function App() {
  return (
    <>
      <div className="container">
        <NavPage></NavPage>

        <Routes>
          <Route
            path="/home"
            element={
              <div className="wrapper">
                <div className="contentBody">
                  <AuthGuard>
                    <Home></Home>
                  </AuthGuard>
                </div>
              </div>
            }
          ></Route>

          <Route path="/login" element={<Login></Login>}></Route>

          <Route
            path="/map"
            element={
              <div className="wrapper">
                <div className="contentBody">
                  <AuthGuard>
                    <Maps></Maps>
                  </AuthGuard>
                </div>
              </div>
            }
          ></Route>

          <Route
            path="/households"
            element={
              <div className="wrapper">
                <div className="contentBody">
                  <AuthGuard>
                    <Households></Households>
                  </AuthGuard>
                </div>
              </div>
            }
          ></Route>

          <Route
            path="/incidents"
            element={
              <div className="wrapper">
                <div className="contentBody">
                  <AuthGuard>
                    <Incidents></Incidents>
                  </AuthGuard>
                </div>
              </div>
            }
          ></Route>
          <Route
            path="/"
            element={<ResitrackLandingPage></ResitrackLandingPage>}
          ></Route>
        </Routes>

        <NavMobile></NavMobile>
      </div>
    </>
  );
}

export default App;
