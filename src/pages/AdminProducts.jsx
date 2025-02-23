import axios from 'axios'
import { useEffect, useState, useRef } from 'react'

import { useNavigate } from 'react-router-dom'

import { Modal } from 'bootstrap'

import ProductInfoForm from '../component/ProductInfoForm.jsx'
import Pagination from '../component/Pagination.jsx'
import Loading from '../component/Loading.jsx'

const api_base = import.meta.env.VITE_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;

export default function AdminProducts(){
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);
  const [pagination, setPagination] = useState({});

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const checkIfSignedIn = async () => {
    try {
      const response = await axios.post(`${api_base}/api/user/check`);
      setIsAuthorized(true);
      getProducts();
    } catch (error) {
      navigate("/admin"); 
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    axios.defaults.headers.common['Authorization'] = token;
    checkIfSignedIn();
  },[]);

  const getProducts = async (page = pagination.current_page, category = "") => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${api_base}/api/${api_path}/admin/products?page=${page}&category=${category}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.log(error.response.data.message);
    }
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${api_base}/logout`);
      setIsAuthorized(false);
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  const [formType, setFormType] = useState("add");

  const addProduct = async (addProductInfo) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${api_base}/api/${api_path}/admin/product`, addProductInfo);
      getProducts(); // because the assigned id is unknown
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  const editProduct = async (id, editProductInfo) => {
    setIsLoading(true);
    try {
      const res = await axios.put(`${api_base}/api/${api_path}/admin/product/${id}`, editProductInfo);
      const productsList = products.map(product => {
        if (product.id === id){
          return { ...editProductInfo.data, id: `${id}` };
        } else {
          return {...product};
        };
      });
      setProducts(productsList);
      setTempProduct({ ...editProductInfo.data, id: `${id}` });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  const deleteProduct = async (id) => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`${api_base}/api/${api_path}/admin/product/${id}`);
      getProducts(); // because the pagination data may change
      setTempProduct(null);
    } catch (error) {
      console.log(error.response.data.message);
    }
    setIsLoading(false);
  }

  const modalRef = useRef(null);
  const customModal = useRef(null);
  useEffect(() => {
    if (modalRef.current !== null){
      customModal.current = new Modal(modalRef.current, {
        backdrop: "static",
        keyboard: false,
      })
    }
  },[modalRef.current]);
  
  const openModal = () => {
    customModal.current.show();
  };
  const closeModal = () => {
    customModal.current.hide();
  };

  return(
    <>
      <div className='products'>
        <div className="row mb-12">
          <div className="col-lg-6">
            <div className='mb-4 d-flex justify-content-between align-items-start'>
              <h3 className='mb-0'>產品列表</h3>
              <button type="button" className="btn btn-sm btn-success" onClick={() => {
                openModal();
                setFormType("add");
              }}>新增產品</button>
            </div>
            <table className='table align-middle table-hover'>
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">啟用</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">產品細節</th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {products.length > 0 ? (
                  products.map((product) => {
                    return (
                      <tr key={product.id}>
                        <td>{`${product.title}`}</td>
                        <td className={`${product.is_enabled ? "" : "text-danger" }`}>{`${product.is_enabled ? "已啟用" : "未啟用" }`}</td>
                        <td>{`${product.origin_price}`} 元</td>
                        <td>{`${product.price}`} 元</td>
                        <td>
                          <button className='btn btn-sm btn-primary' 
                          onClick={()=> setTempProduct(product)}>
                            更多細節
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="5">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination pagination={pagination} getProducts={getProducts}></Pagination>
          </div>
          <div className="col-lg-6">
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <h3 className="mb-0">產品資訊</h3>
              <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => signOut()}>登出 Sign Out</button>
            </div>
            {tempProduct ? (
              <div className="card" key={tempProduct.id}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className='mb-0'>{`${tempProduct.category}`}</h5>
                  <div className="btn-group" role="group">
                    <button type="button" className="btn btn-sm btn-warning" onClick={(e) => {
                      openModal();
                      setFormType("edit");
                    }}>編輯</button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteProduct(tempProduct.id)}>刪除</button>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => setTempProduct(null)}>關閉</button>
                  </div>
                </div>
                <div className="card-body">
                  <img src={`${tempProduct.imageUrl}`} alt={`${tempProduct.title}`} className='main-image mb-4'/>
                  <h4 className='card-title mb-4'>{`${tempProduct.title}`}</h4>
                  <p className='card-text'>{`${tempProduct.description}`}</p>
                  <p className='card-text'>{`${tempProduct.content}`}</p>
                  <p className='card-text'>售價：<del>{`${tempProduct.origin_price}`} 元</del> {`${tempProduct.price}`} 元</p>
                  <h5>更多圖片：</h5>
                  <div className='d-flex flex-wrap'>
                    {tempProduct.imagesUrl?.map((url, index) => {
                      return(
                        <img key={index} src={url} className="images my-1 me-2" />
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <h4>請選擇產品</h4>
            )}
          </div>
        </div>
      </div>

      <div ref={modalRef} className="modal fade" id="productInfoFormModal" tabIndex="-1">
        <ProductInfoForm tempProduct={tempProduct} formType={formType} addProduct={addProduct} editProduct={editProduct} closeModal={closeModal}></ProductInfoForm>
      </div>

      <Loading type={"spinningBubbles"} color={"#6c757d"} className={`position-absolute top-50 start-50 translate-middle ${isLoading ? "d-flex" : "d-none"}`}></Loading>
    </>
  )
}