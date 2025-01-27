import { Routes, Route } from 'react-router-dom'
import Navbar from './component/NavBar.jsx'
import Cart from './pages/Cart.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <>
      <Navbar></Navbar>
      <div className="container">
        <Routes>
          <Route path='/' element={<Cart />}></Route>
          <Route path='/admin' element={<Admin />}></Route>
        </Routes>
      </div>
      {/*<Loading type={"spinningBubbles"} color={"#6c757d"} className={`position-absolute top-50 start-50 translate-middle ${isLoading ? "d-flex" : "d-none"}`}></Loading>*/}
    </>
  )
}

export default App
