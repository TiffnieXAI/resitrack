import './App.css'
import Navbar from './components/Navbar'
import PageNav from './components/PageNav'
function App() {
 

  return (
    <>
      <Navbar></Navbar>
      <div className='page-container'>
        <PageNav></PageNav>
      </div>
      
    </>
  )
}

export default App
