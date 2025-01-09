import { useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'

const api_base = "https://ec-course-api.hexschool.io/v2";
const api_path = "esgrace";

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null)

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

  async function checkIfSignedIn() {
    try {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;
      const response = await axios.post(`${api_base}/api/user/check`);
      getProducts();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  async function getProducts() {
    try {
      const res = await axios.get(`${api_base}/api/${api_path}/admin/products/all`);
      setProducts(Object.entries(res.data.products))
      setIsAuthorized(true);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
 
  return (
    <>
      {isAuthorized ? (
        <div className='products container mt-5'>
          <div className="row">
            <div className="col-6">
              <h3 className="mb-3">產品列表</h3>
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
                  {products.map((product) => {
                    return (
                      <tr key={product[0]}>
                        <td>{`${product[1].title}`}</td>
                        <td>{`${product[1].is_enabled ? "是" : "否" }`}</td>
                        <td>{`${product[1].origin_price}`} 元</td>
                        <td>{`${product[1].price}`} 元</td>
                        <td>
                          <button className='btn btn-sm btn-primary' 
                          onClick={()=> setTempProduct(product)}>
                            更多細節
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <h3 className="mb-3" >產品資訊</h3>
              {tempProduct ? (
                <div className="card" key={tempProduct[0]}>
                  <div className="card-header">
                    <h5 className='mb-0'>{`${tempProduct[1].category}`}</h5>
                  </div>
                  <div className="card-body">
                    <img src={`${tempProduct[1].imageUrl}`} alt={`${tempProduct[1].title}`} className='mb-3'/>
                    <h4 className='card-title mb-3'>{`${tempProduct[1].title}`}</h4>
                    <p className='card-text'>{`${tempProduct[1].description}`}</p>
                    <p className='card-text'>{`${tempProduct[1].content}`}</p>
                    <p className='card-text'>原價：{`${tempProduct[1].origin_price}`} 元</p>
                    <p className='card-text'>售價：{`${tempProduct[1].price}`} 元</p>
                  </div>
                </div>
              ) : (
                <h4>請選擇產品</h4>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="sign-in vh-100 container d-flex flex-column justify-content-center align-content=center">
          <div className="row justify-content-center">
            <div className="col-4">
              <h3 className='mb-4'>登入 Sign in</h3>
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-3 text-start'>
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
                <div className="mb-3 text-start">
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
