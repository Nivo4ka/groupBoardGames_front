import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import Paper from "@mui/material/Paper";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import "./EventsForReviews.scss";
import AddReview from "../AddReview/AddReview";

const EventsForReviews = () => {
  let navigate = useNavigate();
  let regUser = JSON.parse(localStorage.getItem("user"));
  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const settings = {
    infinite: true,
    dots: false,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };
  const [alert, setAlert] = useState({
    open: false,
    text: "",
  });
  const [review, setReview] = useState({
    eventID: "",
    autorID: "",
    description: "",
    rating: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/event/getEventsForReviews", {
        headers: {
          token: regUser.token,
        },
      })
      .then((res) => {
        setEvents(res.data.events);
      });
  }, [addReviewOpen]);

  const goToEvent = (_id) => {
    navigate(`/EventPage/${_id}`);
  };

  const goToAddReview = (elem) => {
    setReview({ ...review, autorID: elem.autorID, eventID: elem._id });
    setAddReviewOpen(true);
  };

  const saveReview = (e) => {
    if (review.rating !== 0) {
      axios
        .post(
          "http://localhost:8080/review/post",
          {
            description: review.description,
            rating: review.rating,
            autorID: review.autorID,
            eventID: review.eventID,
          },
          {
            headers: {
              token: regUser.token,
            },
          }
        )
        .then((res) => {
          handleClose();
        });
    } else {
      setAlert({
        open: true,
        text: "Рейтинг должен быть выставлен",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, text: "" });
  };

  const handleClose = () => {
    setAddReviewOpen(false);
    setReview({
      autorID: "",
      description: "",
      rating: 0,
      eventID: "",
    });
  };

  return (
    <main className="main">
      <div className="container-for-reviews">
        <div className="div-btn">
          <div>
            <p>Прошедшие события</p>
          </div>
        </div>
        <div className="list-games">
          {events &&
            events.map((val, index) => (
              <Paper key={index} className="panel-event-my">
                <div className="short-event">
                  <div
                    className="imgGame"
                    onClick={() => goToEvent(val._doc._id)}
                  >
                    <Slider {...settings}>
                      {val.games &&
                        val.games.map((item) => (
                          <img
                            className="imgGame-main"
                            key={item._id}
                            src={item.image}
                            alt={`games-${item._id}`}
                          />
                        ))}
                    </Slider>
                  </div>
                  <div className="main-desc">
                    <div onClick={() => goToEvent(val._doc._id)}>
                      <div className="main-desc-name">{val._doc.name}</div>

                      <div>
                        Дата и время:{" "}
                        {new Date(val._doc.dateTime).toLocaleString("ru-RU")}
                      </div>
                      <div>
                        Адрес: {val._doc.region} {val._doc.locality}{" "}
                        {val._doc.street} {val._doc.houseNumber}
                      </div>
                    </div>
                    <div className="reviews-events-btn">
                      {!val.review && (
                        <button
                          className="review-btn"
                          onClick={() => goToAddReview(val._doc)}
                        >
                          Написать отзыв
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Paper>
            ))}
        </div>
      </div>
      {addReviewOpen && (
        <AddReview
          open={addReviewOpen}
          saveReview={saveReview}
          handleClose={handleClose}
          setReview={setReview}
          review={review}
          setAddReviewOpen={setAddReviewOpen}
        />
      )}
      {alert.open && (
        <Snackbar
          open={alert.open}
          autoHideDuration={13000}
          onClose={() => handleCloseAlert()}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          action={
            <React.Fragment>
              <CloseIcon color="secondary" onClick={() => handleCloseAlert()} />
            </React.Fragment>
          }
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => handleCloseAlert()}
            severity="error"
          >
            {alert.text}
          </MuiAlert>
        </Snackbar>
      )}
    </main>
  );
};

export default EventsForReviews;
