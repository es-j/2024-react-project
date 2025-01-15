import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { set, useForm } from 'react-hook-form'

import { Modal } from 'bootstrap'

import ProductInfoForm from './ProductInfoForm.jsx'

const api_base = "https://ec-course-api.hexschool.io/v2";
const api_path = "esgrace";

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const {register, handleSubmit, formState: { errors }} = useForm({mode: "onTouched"});
  const onSubmit = (data) => signIn(data);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const signIn = async (data) => {
    try {
      const response = await axios.post(`${api_base}/admin/signin`, data);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${ token }; expires=${ new Date (expired) };`;
      checkIfSignedIn();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const checkIfSignedIn = async () => {
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if (!token) {
        setIsAuthorized(false);
        return;
      }
      axios.defaults.headers.common['Authorization'] = token;
      const response = await axios.post(`${api_base}/api/user/check`);
      setIsAuthorized(true);
      getProducts();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    checkIfSignedIn();
  },[]);

  const getProducts = async () => {
    try {
      const res = await axios.get(`${api_base}/api/${api_path}/admin/products/all`);
      let productsList = []; 
      Object.keys(res.data.products).map((id) => {
        const product = {
          ...res.data.products[id], 
          "id" : id
        };
        productsList.push(product);
      })
      setProducts(productsList);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const signOut = async () => {
    try {
      const res = await axios.post(`${api_base}/logout`);
      setIsAuthorized(false);
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
      console.log(error);
    }
  }

  const [formType, setFormType] = useState("add");

  const addProduct = async (addProductInfo) => {
    try {
      const res = await axios.post(`${api_base}/api/${api_path}/admin/product`, addProductInfo);
      getProducts(); // because the assigned id is unknown
    } catch (error) {
      console.log(error);
    }
  }

  const editProduct = async (id, editProductInfo) => {
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
  }

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`${api_base}/api/${api_path}/admin/product/${id}`);
      setProducts(products.filter((product) => product.id !== id));
      setTempProduct(null);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const modalRef = useRef(null);
  const customModal = useRef(null);
  useEffect(() => {
    if (modalRef.current !== null){
      customModal.current = new Modal(modalRef.current);
    }
  });
  
  const openModal = () => {
    customModal.current.show();
  };
  const closeModal = () => {
    customModal.current.hide();
  };
 
  return (
    <>
      {isAuthorized ? (
        <>
          <header className='mt-12 mb-4'>
            <div className="container text-end">
              <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => signOut()}>登出 Sign Out</button>
            </div>
          </header>
          <div className='products container mb-12'>
            <div className="row">
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
              </div>
              <div className="col-lg-6">
                <h3 className='mb-4'>產品資訊</h3>
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
                            <img key={index} src={url} className="images my-1" />
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
        </>
      ) : (
        <div className="sign-in vh-100 container d-flex flex-column justify-content-center">
          <div className="row justify-content-center">
            <div className="col-8 col-md-4">
              <h3 className='mb-6'>登入 Sign In</h3>
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-4 text-start'>
                  <label htmlFor="email" className='form-label'>使用者名稱 Username</label>
                  <input type="email" className={`form-control ${errors.username && "is-invalid"}`} id='email' 
                    {...register("username",{
                      required: {
                      value: true,
                      message: "電子郵件為必填",
                    },
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "電子郵件格式不正確",
                    },
                    })} />
                  {errors.username && (<div className="invalid-feedback">{errors?.username?.message}</div>)}
                </div>
                <div className="mb-4 text-start">
                  <label htmlFor="password" className='form-label'>密碼 Password</label>
                  <input type="password" className={`form-control ${errors.password && "is-invalid"}`} id="password" 
                  {...register("password", {
                    required:{
                      value: true,
                      message: "密碼為必填"
                    }
                  })} />
                  {errors.password && (<div className="invalid-feedback">{errors?.password?.message}</div>)}
                </div>
                <button type="submit" className='btn btn-primary'>登入</button>
              </form>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default App
