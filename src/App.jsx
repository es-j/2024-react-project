import { Outlet } from 'react-router-dom'
import Navbar from './component/NavBar.jsx'

function App() {
  return (
    <>
      <Navbar></Navbar>
      <div className="container">
        <Outlet />
      </div>
    </>
  )
}

export default App
