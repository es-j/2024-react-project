import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Modal } from 'bootstrap'

import ProductDetail from '../component/ProductDetail'
import Pagination from '../component/Pagination.jsx'
import CartTable from '../component/CartTable.jsx'


const api_base = "https://ec-course-api.hexschool.io/v2";
const api_path = "esgrace";

export default function Cart(){
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [pagination, setPagination] = useState({})
  const [cartProducts, setCartProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

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
    getCartProducts();
  };

  const getCartProducts = async () => {
    try {
      const res = await axios.get(`${api_base}/api/${api_path}/cart`);
      setCartProducts(res.data.data.carts);
      setCartTotal(res.data.data.total);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const editCartProduct = async ( id, data ) => {
    try {
      const res = await axios.put(`${api_base}/api/${api_path}/cart/${id}`, data);
      getCartProducts();
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const deleteCartProduct = async (id) => {
    try {
      const res = await axios.delete(`${api_base}/api/${api_path}/cart/${id}`);
      getCartProducts();
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const deleteAllCartProducts = async () => {
    try {
      const res = await axios.delete(`${api_base}/api/${api_path}/carts`);
      setCartProducts([]);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    getProducts();
    getCartProducts();
  },[])

  const {register, handleSubmit, formState: { errors }, reset} = useForm({mode: "onTouched"});
  const onSubmit = (data) => {
    if (cartProducts.length === 0){
      alert("購物車內沒有商品");
    } else {
      placeOrder(data);
    }
  }

  const placeOrder = async (data) => {
    const { name, email, tel, address, message } = data;
    const customerInfo = {
      data: {
        user: { name, email, tel, address },
        message,
      },
    };
    try {
      const res = await axios.post(`${api_base}/api/${api_path}/order`, customerInfo);
      getCartProducts();
      reset();
      alert(`${res.data.message}，訂單編號 ${res.data.orderId}`);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const [detailModalProduct, setDetailModalProduct] = useState({imagesUrl:[]});
  const modalRef = useRef(null);
  const customModal = useRef(null);
  useEffect(() => {
    if (modalRef.current !== null){
      customModal.current = new Modal(modalRef.current);
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
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => {
                          setDetailModalProduct(product);
                          openModal();
                        }}>更多資訊</button>
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
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h3 className='mb-0'>購物車</h3>
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteAllCartProducts()}>清空購物車</button>
      </div>
      <CartTable cartProducts={cartProducts} cartTotal={cartTotal} deleteCartProduct={deleteCartProduct} editCartProduct={editCartProduct}></CartTable>
      <h3 className='mb-4 text-center'>訂購資訊</h3>
      <div className='row justify-content-center mb-12'>
        <form className='col-md-6 text-center' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-4 text-start'>
            <label htmlFor="name" className='form-label'>姓名 Name</label>
            <input type="text" className={`form-control ${errors.name && "is-invalid"}`} id='name' 
              {...register("name",{
                required: {
                  value: true,
                  message: "姓名為必填",
                },
              })} />
            {errors.name && (<div className="invalid-feedback">{errors?.name?.message}</div>)}
          </div>
          <div className='mb-4 text-start'>
            <label htmlFor="email" className='form-label'>電子郵件 Email</label>
            <input type="email" className={`form-control ${errors.email && "is-invalid"}`} id='email' 
              {...register("email",{
                required: {
                value: true,
                message: "電子郵件為必填",
              },
              pattern: {
                value: /^\S+@\S+$/i,
                message: "電子郵件格式不正確",
              },
              })} />
            {errors.email && (<div className="invalid-feedback">{errors?.email  ?.message}</div>)}
          </div>
          <div className='mb-4 text-start'>
            <label htmlFor="tel" className='form-label'>電話 Telephone Number</label>
            <input type="tel" className={`form-control ${errors.tel && "is-invalid"}`} id='tel' 
              {...register("tel",{
                required: {
                  value: true,
                  message: "電話為必填",
                },
                minLength: {
                  value: 8,
                  message: "電話應為八碼以上",
                },
              })} />
            {errors.tel && (<div className="invalid-feedback">{errors?.tel?.message}</div>)}
          </div>
          <div className='mb-4 text-start'>
            <label htmlFor="address" className='form-label'>地址 Address</label>
            <input type="address" className={`form-control ${errors.address && "is-invalid"}`} id='address' 
              {...register("address",{
                required: {
                  value: true,
                  message: "地址為必填",
                },
              })} />
            {errors.address && (<div className="invalid-feedback">{errors?.address?.message}</div>)}
          </div>
          <div className="mb-4 text-start">
            <label htmlFor="message" className="form-label">留言 Note</label>
            <textarea className={`form-control`} id="message"
              {...register( "message")} />
          </div>
          <button type="submit" className='btn btn-success'>送出</button>
        </form>
      </div>
      <ProductDetail modalRef={modalRef} closeModal={closeModal} detailModalProduct={detailModalProduct} addCartProduct={addCartProduct} editCartProduct={editCartProduct} cartProducts={cartProducts} />
    </>
  )
}