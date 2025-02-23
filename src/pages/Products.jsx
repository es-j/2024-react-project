import axios from 'axios'
import { useEffect, useState } from 'react'

import Pagination from '../component/Pagination.jsx'
import { Link } from 'react-router-dom'

const api_base = import.meta.env.VITE_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;

export default function Cart(){
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [pagination, setPagination] = useState({})

  const getProducts = async (page = pagination.current_page, category = "") => {
    try {
      const res = await axios.get(`${api_base}/api/${api_path}/products?page=${page}&category=${category}`);
      setDisplayedProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const addCartProduct = async ( id, qty = 1 ) => {
    const data = {
      data: {
        product_id: id,
        qty
      }
    };
    const res = await axios.post(`${api_base}/api/${api_path}/cart`, data);
  };

  useEffect(() => {
    getProducts();
  },[])

  return(
    <>
      <h3 className='mb-4'>產品列表</h3>
      <div className="row g-4 mb-12">
        {displayedProducts?.map((product) => {
          return (
            <div className="col-lg-6" key={product.id}>
              <div className="card product-list-card mb-3 h-100">
                <div className="row g-0 h-100">
                  <div className="col-md-6">
                    <img src={`${product.imageUrl}`} className="img-fluid rounded-start h-100 object-fit-cover" alt={`${product.title}`} />
                  </div>
                  <div className="col-md-6">
                    <div className="card-body d-flex flex-column h-100">
                      <h5 className="card-title">{product.title}</h5>
                      <p className="card-text">價格：<del>{product.origin_price} 元</del> {product.price} 元</p>
                      <div className="flex-grow-1"></div>
                      <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end">
                        <button type="button" className="btn btn-sm btn-outline-success" onClick={() => addCartProduct( product.id, 1)}>加入購物車</button>
                        <Link to={`/products/${product.id}`} type="button" className="btn btn-sm btn-outline-secondary">更多資訊</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <Pagination pagination={pagination} getProducts={getProducts}/>
      </div>
    </>
  )
}