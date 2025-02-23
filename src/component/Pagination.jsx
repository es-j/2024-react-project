import { Link } from "react-router-dom";

const Pagination = ({pagination, getProducts}) =>{
  const {total_pages, has_pre, has_next, current_page} = pagination;
  return (
    <>
      <nav aria-label="Page navigation">
        <ul className="pagination pagination-sm justify-content-end">
          <li className={`page-item ${has_pre ? "" : "disabled"}`}><Link className="page-link" href="#" onClick={() => getProducts(current_page - 1)}>Previous</Link></li>
          {[...new Array(total_pages)].map((page, index) => {
            return (
              <li className ={`page-item ${current_page === index + 1 ? "active" : ""}`} aria-current="page" key={index + 1}><Link className="page-link" href="#" onClick={() => getProducts(index + 1)}>{index + 1}</Link></li>
            )
          })}
          <li className={`page-item ${has_next ? "" : "disabled"}`}><Link className="page-link" href="# " onClick={() => getProducts(current_page + 1)}>Next</Link></li>
        </ul>
      </nav>
    </>
  )
}

export default Pagination