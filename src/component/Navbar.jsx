import { Link } from "react-router-dom" 
export default function Navbar(){
  return(
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">電商</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/2024-react-project/">Cart</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/2024-react-project/admin">Admin</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}