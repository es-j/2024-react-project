import { useState, useEffect } from "react"
function ProductDetail({ modalRef, closeModal, detailModalProduct, addCartProduct, editCartProduct, cartProducts}) {
  const [modalProductQuantity , setModalProductQuantity] = useState(1);
  useEffect(()=>{
    setModalProductQuantity(1);
  },[detailModalProduct])

  return (
    <>
      <div ref={modalRef} className="modal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{detailModalProduct?.title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => closeModal()}></button>
            </div>
            <div className="modal-body container">
              <div className="row">
                <div id="carousel" className="carousel slide col-lg-6 mb-4 mb-lg-0" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {detailModalProduct.imagesUrl.length > 0 ? (
                      <>
                        {detailModalProduct?.imagesUrl.map((url, index) => {
                          return (
                            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                              <img src={url} className="d-block w-100 object-fit-cover modal-carousel-item-img" alt={`${detailModalProduct?.title}_${index+1}`} />
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
                  <p>產品名稱：{detailModalProduct?.title}</p>
                  <p>產品原價：{detailModalProduct?.origin_price} 元</p>
                  <p>產品售價：{detailModalProduct?.price} 元</p>
                  <p>產品內容：{detailModalProduct?.content}</p>
                  <p>{detailModalProduct?.description}</p>
                  <div className="input-group input-group-sm ms-auto w-25 mb-4">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setModalProductQuantity(prev => (prev > 0 ? prev - 1 : 0))}>-</button>
                    <input type="text" className="form-control border-secondary bg-light" value={modalProductQuantity} readOnly />
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setModalProductQuantity(prev => prev + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal" onClick={() => closeModal()}>Close</button>
              <button type="button" className="btn btn-sm btn-outline-success" onClick={() => {
                const ifCartHasTheSameProduct = cartProducts.find((product) => product.product_id === detailModalProduct?.id);
                if (ifCartHasTheSameProduct){
                  try {
                    const data = {
                      data: {
                        product_id: detailModalProduct?.id,
                        qty: ifCartHasTheSameProduct.qty + modalProductQuantity
                      }
                    };
                    editCartProduct(ifCartHasTheSameProduct.id, data);
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  addCartProduct(detailModalProduct?.id, modalProductQuantity);
                }
                closeModal();
              }
              }>加入購物車</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetail