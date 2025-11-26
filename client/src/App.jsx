import './App.css'
import Navbar from './components/Navbar'
import PageNav from './components/PageNav'
import { Routes ,Route } from 'react-router-dom'
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx'

function App() {


  return (
    <>
      <Navbar></Navbar>
      <div className='page-container'>
        <div className='page-wrapper'>
          
          <PageNav></PageNav>
            <Routes>
            <Route path='/' element={<Home></Home>}/>
            <Route path='/dashboard' element={<Dashboard></Dashboard>}/>
          </Routes>
        </div>
        
      </div>
      
      
    </>
  )
}

export default App
