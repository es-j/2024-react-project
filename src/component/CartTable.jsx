export default function CartTable({ cartProducts, cartTotal, editCartProduct, deleteCartProduct}) {
  return (
    <>
      <table className="table align-middle table-hover mb-12">
        <thead>
          <tr>
            <th scope="col">產品名稱</th>
            <th style={{width: "15%"}} scope="col">數量 / 單位</th>
            <th style={{width: "12%"}} scope="col" className="text-end">單價</th>
            <th style={{width: "12%"}} scope="col" className="text-end">總價</th>
            <th style={{width: "10%"}} scope="col"></th>
          </tr>
        </thead>
        <tbody className='table-group-divider'>
          {cartProducts.length === 0 ? (
            <tr><td colSpan="5" className='text-center'>購物車內沒有商品</td></tr>
          ):(
            <>
              {cartProducts.map((product) => {
                return (
                  <tr key={product?.id}>
                    <td>{product?.product.title}</td>
                    <td>
                      <div className="input-group">
                        <input type="text" className="form-control" value={product?.qty} onChange={(e) => {
                          const editCartProductData = {
                            data: {
                              product_id: product.product_id,
                              qty: Number(e.target.value)
                            }
                          };
                          editCartProduct(product?.id, editCartProductData);
                        }}/>
                        <span className="input-group-text"> / {product?.product.unit}</span>
                      </div>
                    </td>
                    <td className="text-end">{product?.product.price} 元</td>
                    <td className="text-end">{product?.final_total} 元</td>
                    <td className="text-end"><button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteCartProduct(product?.id)}>刪除</button></td>
                  </tr>
                )
              })}
            </>
          )}
        </tbody>
        <tfoot className={`${cartProducts.length < 1 ? "d-none" : ""}`}>
          <tr>
            <td colSpan="2"></td>
            <th className="text-end">總金額</th>
            <td className="fw-bold text-danger text-end">{cartTotal} 元</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </>  
  )
}