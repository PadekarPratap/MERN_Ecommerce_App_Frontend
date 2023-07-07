import { useState } from "react"
import { Form } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { reset_page, search } from "../redux/features/globalSlice"


const SearchProducts = () => {

    const [searchProduct, setSearchProduct] = useState('')
    const dispatch = useDispatch()

    const handleSearch = (e) =>{
        e.preventDefault()
        dispatch(search(searchProduct))
        dispatch(reset_page())
    }

  return (
    <Form className="d-flex gap-2" noValidate onSubmit={handleSearch}>
        <Form.Control value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} type="text" placeholder="Search Products..." />
        <button type="submit" className="btn btn-outline-success" >Search</button>
    </Form>
  )
}
export default SearchProducts