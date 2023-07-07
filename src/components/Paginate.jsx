import { Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { next_page, prev_page } from "../redux/features/globalSlice"


const Paginate = ({info, pages}) => {

    const dispatch = useDispatch()
    const {pageNumber} = useSelector((state) => state.global)

  return (
    <div className="d-flex gap-2 align-items-center justify-content-center mt-4">
        <Button disabled={pageNumber <= 1} onClick={() => dispatch(prev_page())} variant="light" >Prev</Button>
        {info}
        <Button disabled={pageNumber >= pages} onClick={() => dispatch(next_page())} variant="light" >Next</Button>
    </div>
  )
}
export default Paginate