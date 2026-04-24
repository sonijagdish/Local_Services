import { loadState, saveState } from "../../utils/localStorage";
import { v4 as uuidv4 } from "uuid";

const getReviews = () => {
  return loadState("reviews") || [];
};

const addReview = (reviewData) => {
  const reviews = loadState("reviews") || [];

  const newReview = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    ...reviewData,
  };

  reviews.push(newReview);
  saveState("reviews", reviews);

  return newReview;
};

export default { getReviews, addReview };