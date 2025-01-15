import { useEffect, useState } from 'react';
import { set, useForm } from 'react-hook-form'

const Input = ( { register, errors, id, labelText, type, rules }) => {
  return (
    <>
      <label htmlFor={id} className="form-label">{labelText}</label>
      <input type={type} className={`form-control ${errors[id] ? "is-invalid" : ""}`} id={id}
        {...register( id, rules )} />
      {errors[id] && (<div className="invalid-feedback">{errors[id]?.message}</div>)}
    </>
  )
};

const MoneyInput = ( { register, errors, id, labelText, rules }) => {
  return (
    <>
      <label htmlFor={id} className="form-label">{labelText}</label>
      <div className="input-group">
        <span className="input-group-text">$</span>
        <input type="number" className={`form-control ${errors[id] ? "is-invalid" : ""}`} id={id}
          {...register( id, rules )} />
        {errors[id] && (<div className="invalid-feedback">{errors[id]?.message}</div>)}
      </div>
    </>
  )
};

const ProductInfoForm = ({ formType, tempProduct, addProduct, editProduct, closeModal}) => {
  const {register, handleSubmit, reset, setValue, formState: { errors }, watch} = useForm({
    defaultValues: {
      category: null,
      content: null,
      description: null,
      imageUrl: null,
      imagesUrl: [],
      is_enabled: 0,
      num: null,
      origin_price: null,
      price: null,
      title: null,
      unit: null,
    },
    mode: "onTouched"
  });
  
  useEffect(()=>{
    if (formType === "edit"){
      setValue(`category`, tempProduct.category)
      setValue(`content`, tempProduct.content)
      setValue(`description`, tempProduct.description)
      setValue(`imageUrl`, tempProduct.imageUrl)
      setValue(`imagesUrl`, tempProduct.imagesUrl)
      setValue(`is_enabled`, tempProduct.is_enabled)
      setValue(`num`, tempProduct.num)
      setValue(`origin_price`, tempProduct.origin_price)
      setValue(`price`, tempProduct.price)
      setValue(`title`, tempProduct.title)
      setValue(`unit`, tempProduct.unit)
    } else if (formType === "add"){
      setValue(`category`, null)
      setValue(`content`, null)
      setValue(`description`, null)
      setValue(`imageUrl`, null)
      setValue(`imagesUrl`, [])
      setValue(`is_enabled`, null)
      setValue(`num`, null)
      setValue(`origin_price`, null)
      setValue(`price`, null)
      setValue(`title`, null)
      setValue(`unit`, null)
    }
  },[formType, tempProduct])

  const onSubmit = (data) => {
    data.origin_price = Number(data.origin_price);
    data.price = Number(data.price);
    data.is_enabled = Number(data.is_enabled);
    const productInfo = { "data": data };
    if (formType === "add"){
      addProduct(productInfo);
    } else if (formType === "edit"){
      editProduct( tempProduct.id, productInfo);
    };
    closeModal();
    setIsSubmitSuccessful(true);
  };

  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  useEffect(() => {
    if (isSubmitSuccessful){
      reset({ category: null, content: null, description: null, imageUrl: null, imagesUrl: [],
        is_enabled: 0, num: null, origin_price: null, price: null, title: null, unit: null,
      })
      setIsSubmitSuccessful(false);
    }
  },[isSubmitSuccessful])

  return (
    <>
      <div className="modal-dialog">
        <div className="modal-content">
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="productInfoFormModalLabel">{formType === "add" ? `新增` : `修改`}產品</h1>
              <button type="button" className="btn-close" onClick={() => closeModal()}></button>
            </div>
            <div className="modal-body">
              <div className="mb-4 text-start">
                <Input register={register} errors={errors} id="title" labelText="產品名稱" type="text"
                rules={{
                  required: {
                    value: true,
                    message: "產品名稱為必填",
                  }
                }}></Input>
              </div>
              <div className="mb-4 text-start">
                <div className="row">
                  <div className="col-6">
                    <Input register={register} errors={errors} id="category" labelText="類別" type="text"
                    rules={{
                      required: {
                        value: true,
                        message: "類別為必填"
                      }
                    }}></Input>
                  </div>
                  <div className="col-6">
                    <Input register={register} errors={errors} id="unit" labelText="單位" type="text"
                    rules={{
                      required: {
                        value: true,
                        message: "單位為必填",
                      }
                    }}></Input>
                  </div>
                </div>
              </div>
              <div className="mb-4 text-start">
                <div className="row">
                  <div className="col-6">
                    <MoneyInput register={register} errors={errors} id="origin_price" labelText="原價"
                    rules={{
                      required: {
                        value: true,
                        message: "原價為必填",
                      },
                      min: {
                        value: 0,
                        message: "原價需高於 0 元",
                      },
                    }}></MoneyInput>
                  </div>
                  <div className="col-6">
                    <MoneyInput register={register} errors={errors} id="price" labelText="售價"
                    rules={{
                      required: {
                        value: true,
                        message: "售價為必填",
                      },
                      min: {
                        value: 0,
                        message: "售價需高於 0 元",
                      },
                      max: {
                        value: watch("origin_price"),
                        message: "售價需等於或小於原價",
                      },
                    }}></MoneyInput>
                  </div>
                </div>
              </div>
              <div className="mb-4 text-start">
                <label htmlFor="description" className="form-label">產品描述</label>
                <textarea className={`form-control ${errors.description ? "is-invalid" : ""}`} id="description"
                  {...register( "description", {
                    required: {
                      value: true,
                      message: "產品描述為必填",
                    },
                    maxLength: {
                      value: 200,
                      message: "產品描述上限 200 字",
                    }
                  })} />
                {errors.description && (<div className="invalid-feedback">{errors?.description?.message}</div>)}
              </div>
              <div className="mb-4 text-start">
                <Input register={register} errors={errors} id="content" labelText="產品內容" type="text"
                rules={{
                  required: {
                    value: true,
                    message: "產品內容為必填",
                  },
                  maxLength: {
                    value: 30,
                    message: "產品內容上限 30 字",
                  }
                }}></Input>
              </div>
              <div className="mb-4 text-start">
                <Input register={register} errors={errors} id="imageUrl" labelText="主圖網址" type="url"
                rules={{
                  required: {
                    value: true,
                    message: "主圖網址為必填",
                  }
                }}></Input>
              </div>
              <div className="mb-4 form-check">
                <input type="checkbox" className={`form-check-input`} id="is_enabled"
                  {...register("is_enabled")} />
                <label htmlFor="is_enabled" className="form-check-label">啟用</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => closeModal()}>關閉</button>
              <button type="submit" className="btn btn-primary">{formType === "add" ? `新增` : `修改`}產品</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ProductInfoForm