import React from "react";
import { Rating, Dialog, DialogContent, DialogTitle } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./ReadReview.scss";

const ReadReview = ({ open, setReadReviewOpen, usersReviews }) => {
  return (
    <Dialog
      className="read-review"
      open={open}
      onClose={() => setReadReviewOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Отзывы</DialogTitle>
      <DialogContent>
        <div className="reviews">
          {usersReviews &&
            usersReviews.map((elem, index) => (
              <div className="review" key={index}>
                <div className="user-rev">
                  {elem.user.avatar ? (
                    <img className="ava" src={elem.user.avatar}></img>
                  ) : (
                    <img className="ava"></img>
                  )}
                  <p>
                    {elem.user.firstName} {elem.user.secondName}
                  </p>
                  <Rating
                    name="customized-color"
                    value={elem._doc.rating}
                    precision={1}
                    icon={<FavoriteIcon fontSize="inherit" />}
                    emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                    readOnly
                  />
                </div>
                <p>{elem._doc.description}</p>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReadReview;
