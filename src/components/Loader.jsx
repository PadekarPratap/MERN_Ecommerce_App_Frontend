import ClipLoader from "react-spinners/ClipLoader"


const Loader = ({loaderSize}) => {
  return  <ClipLoader className="d-block m-auto" size={loaderSize} />
}

Loader.defaultProps = {
  loaderSize: 50
}

export default Loader