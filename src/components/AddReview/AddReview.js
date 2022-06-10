import React from "react";
import {
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./AddReview.scss";

const AddReview = ({
  open,
  setAddReviewOpen,
  review,
  setReview,
  saveReview,
  handleClose,
}) => {
  return (
    <Dialog
      className="read-review"
      open={open}
      onClose={() => setAddReviewOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Написать отзыв</DialogTitle>
      <DialogContent>
        <div className="input-form-review">
          <div>
            <Rating
              name="customized-color"
              value={review.rating}
              icon={<FavoriteIcon fontSize="inherit" />}
              emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
              onChange={(e) => {
                setReview({ ...review, rating: +e.target.value });
              }}
            />
            <div className="game-div">
              <TextField
                id="input-description"
                name="input-description"
                label="Отзыв"
                type="text"
                variant="outlined"
                multiline
                rows={4}
                value={review.description}
                onChange={(e) =>
                  setReview({ ...review, description: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button className="cancel-btn" onClick={() => handleClose()}>
          Отмена
        </button>
        <button className="agree-btn" onClick={(e) => saveReview(e)}>
          Отправить отзыв
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReview;
