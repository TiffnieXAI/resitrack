import './App.css'
import Home from './pages/Home.jsx';
import NavPage from './components/NavPage.jsx';
import NavMobile from './components/NavMobile.jsx';
import { Routes ,Route } from 'react-router-dom'

import Login from './pages/Login.jsx';
function App() {


  return (
    <>
      <div className='container'>
        <NavPage></NavPage>
        <div className='wrapper'>
          <Routes>
              <Route path='/' element={<Home></Home>}></Route>
          </Routes>
        </div>
        <NavMobile></NavMobile>
        
      </div>
      
      
    </>
  )
}

export default App
