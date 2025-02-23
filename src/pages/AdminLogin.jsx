import axios from 'axios'
import { useEffect, useState,  } from 'react'
import { useForm } from 'react-hook-form'

import { useNavigate } from 'react-router-dom'

import Loading from '../component/Loading.jsx'

const api_base = import.meta.env.VITE_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;

export default function AdminLogin(){
  const {register, handleSubmit, formState: { errors }} = useForm({mode: "onTouched"});
  const onSubmit = (data) => signIn(data);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const signIn = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${api_base}/admin/signin`, data);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${ token }; expires=${ new Date (expired) };`;
      checkIfSignedIn();
    } catch (error) {
      alert(error.response.data.message);
    }
    setIsLoading(false);
  };

  const checkIfSignedIn = async () => {
    try {
      const response = await axios.post(`${api_base}/api/user/check`);
      setIsAuthorized(true);
      navigate("/admin/products");
    } catch (error) {
      console.log(error.response.data.message);
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

  return(
    <>
      <div className="sign-in mt-12 container d-flex flex-column justify-content-center">
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
      <Loading type={"spinningBubbles"} color={"#6c757d"} className={`position-absolute top-50 start-50 translate-middle ${isLoading ? "d-flex" : "d-none"}`}></Loading>
    </>
  )
}