import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs";

const Rating = ({ value, numReviews, show }) => {
  return (
    <div className="d-flex align-items-center gap-1">
      <div>
        {value >= 1 ? (
          <BsStarFill color={'f8e325'} />
        ) : value >= 0.5 ? (
          <BsStarHalf color={'f8e325'} />
        ) : (
          <BsStar color={'f8e325'} />
        )}
      </div>
      <div>
        {value >= 2 ? (
          <BsStarFill color={'f8e325'} />
        ) : value >= 1.5 ? (
          <BsStarHalf color={'f8e325'} />
        ) : (
          <BsStar color={'f8e325'} />
        )}
      </div>
      <div>
        {value >= 3 ? (
          <BsStarFill color={'f8e325'} />
        ) : value >= 2.5 ? (
          <BsStarHalf color={'f8e325'} />
        ) : (
          <BsStar color={'f8e325'} />
        )}
      </div>
      <div>
        {value >= 4 ? (
          <BsStarFill  color={'f8e325'}/>
        ) : value >= 3.5 ? (
          <BsStarHalf  color={'f8e325'}/>
        ) : (
          <BsStar color={'f8e325'} />
        )}
      </div>
      <div>
        {value >= 5 ? (
          <BsStarFill color={'f8e325'} />
        ) : value >= 4.5 ? (
          <BsStarHalf color={'f8e325'}/>
        ) : (
          <BsStar color={'f8e325'} />
        )}
      </div>
      {show && <div className="ms-1 fs-6">from {numReviews} reviews</div>}
    </div>
  );
};

Rating.defaultProps = {
  show: true
}

export default Rating;
