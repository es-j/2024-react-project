import axios from 'axios'
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

const api_base = import.meta.env.VITE_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;

export default function ProductDetail() {
  const [ product , setProduct ] = useState({imagesUrl:[""]});
  const [ productQuantity , setProductQuantity ] = useState(1);
  
  const [cartProducts, setCartProducts] = useState([]);

  const { id: ProductId } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`${api_base}/api/${api_path}/product/${ProductId}`);
        setProduct(res.data.product);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    getProduct();
  },[])

  const getCartProducts = async () => {
    try {
      const res = await axios.get(`${api_base}/api/${api_path}/cart`);
      setCartProducts(res.data.data.carts);
      setCartTotal(res.data.data.total);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  const addCartProduct = async ( id, qty = 1 ) => {
    const data = {
      data: {
        product_id: id,
        qty
      }
    };
    const res = await axios.post(`${api_base}/api/${api_path}/cart`, data);
  };

  const editCartProduct = async ( id, data ) => {
    try {
      const res = await axios.put(`${api_base}/api/${api_path}/cart/${id}`, data);
      getCartProducts();
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#/products">產品列表</a></li>
          <li className="breadcrumb-item active" aria-current="page">{product?.title}</li>
        </ol>
      </nav>
      <div className="container col-10">
        <h3 className="mb-4">{product?.title}</h3>
        <div className="row">
          <div id="carousel" className="carousel slide col-lg-6 mb-4 mb-lg-0" data-bs-ride="carousel">
            <div className="carousel-inner">
              {product.imagesUrl.length > 0 ? (
                <>
                  {product?.imagesUrl.map((url, index) => {
                    return (
                      <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                        <img src={url} className="d-block w-100 object-fit-cover modal-carousel-item-img" alt={`${product?.title}_${index+1}`} />
                      </div>
                    )
                  })}
                </>
              ) : <></> }
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          <div className="col-lg-6">
            <p>產品名稱：{product?.title}</p>
            <p>產品原價：{product?.origin_price} 元</p>
            <p>產品售價：{product?.price} 元</p>
            <p>產品內容：{product?.content}</p>
            <p>{product?.description}</p>
            <div className="d-flex justify-content-end">
              <div className="input-group input-group-sm w-25 me-4">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setProductQuantity(prev => (prev > 0 ? prev - 1 : 0))}>-</button>
                <input type="text" className="form-control border-secondary bg-light" value={productQuantity} readOnly />
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setProductQuantity(prev => prev + 1)}>+</button>
              </div>
              <button type="button" className="btn btn-sm btn-outline-success" onClick={() => {
                const ifCartHasTheSameProduct = cartProducts.find((product) => product.product_id === product?.id);
                if (ifCartHasTheSameProduct){
                  try {
                    const data = {
                      data: {
                        product_id: product?.id,
                        qty: ifCartHasTheSameProduct.qty + productQuantity
                      }
                    };
                    editCartProduct(ifCartHasTheSameProduct.id, data);
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  addCartProduct(product?.id, productQuantity);
                }
              }
              }>加入購物車</button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}