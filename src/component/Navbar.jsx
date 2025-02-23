import { NavLink } from "react-router-dom"

const routes = [
  { path: "/", name: "Home" },
  { path: "/products", name: "Products" },
  { path: "/cart", name: "Cart" },
  { path: "/admin", name: "Admin" },
];

export default function Navbar(){
  return(
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="#/">電商</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {routes.map((route) => (
                <li className="nav-item" key={route.path}>
                  <NavLink className="nav-link" to={route.path}>{route.name}</NavLink>
                </li>
              ) )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}