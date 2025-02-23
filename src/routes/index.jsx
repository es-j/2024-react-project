import { createHashRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Products from '../pages/Products.jsx'
import ProductDetail from "../pages/ProductsDetail.jsx";
import Cart from '../pages/Cart.jsx'
import AdminLogin from '../pages/AdminLogin.jsx'
import AdminProducts from '../pages/AdminProducts.jsx'
import NotFound from '../pages/NotFound.jsx'

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/:id",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      }
      ,
      {
        path: "/admin",
        element: <AdminLogin />,
      },
      {
        path: "/admin/products",
        element: <AdminProducts />,
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
])


export default router