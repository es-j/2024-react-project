import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import CartTable from '../component/CartTable.jsx'

const api_base = import.meta.env.VITE_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;

export default function Cart(){
  const [cartProducts, setCartProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

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

  return(
    <>
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
    </>
  )
}