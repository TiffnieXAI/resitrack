import './App.css'
import { Routes ,Route } from 'react-router-dom'
import Home from './pages/Home.jsx';
import NavPage from './components/NavPage.jsx';
import NavMobile from './components/NavMobile.jsx';
import Maps from './pages/Maps.jsx';


import Login from './pages/Login.jsx';
function App() {


  return (
    <>
      <div className='container'>
        <NavPage></NavPage>
        
          <Routes>
              <Route path='/' element={<div className='wrapper'><div className='contentBody'><Home></Home></div></div>}></Route>
      
              <Route path='/map' element={<div className='wrapper'><div className='contentBody'><Maps></Maps></div></div>}></Route>

              <Route path='/map' element={<div className='wrapper'><div className='contentBody'><Home></Home></div></div>}></Route>
              

          </Routes>
        
        <NavMobile></NavMobile>
        
      </div>
      
      
    </>
  )
}

export default App
