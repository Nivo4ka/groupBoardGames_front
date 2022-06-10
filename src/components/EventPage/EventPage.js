import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { YMaps, ZoomControl, Map, Placemark } from "react-yandex-maps";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Rating from "@mui/material/Rating";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./EventPage.scss";
import ReadReview from "../ReadReview/ReadReview";

const EventPage = () => {
  let now = new Date();
  let regUser = JSON.parse(localStorage.getItem("user"));
  let navigate = useNavigate();
  const { id } = useParams();
  const [newComment, setNewComment] = useState("");
  const [ReadReviewOpen, setReadReviewOpen] = useState(false);
  const [selectEvent, setSelectEvent] = useState({});
  const settings = {
    infinite: true,
    dots: false,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };
  const [totalRating, setTotalRating] = useState(0);
  const [mapState, setMapState] = useState({
    center: [],
    zoom: 17,
    width: 400,
    height: 250,
  });

  useEffect(() => {
    axios.get(`http://localhost:8080/event/getEvent?_id=${id}`).then((res) => {
      setSelectEvent(res.data.event);

      setMapState({
        ...mapState,
        center: [
          res.data.event.result.latitude,
          res.data.event.result.longitude,
        ],
      });
      if (res.data.event.rating && res.data.event.rating.length) {
        setTotalRating(
          res.data.event.rating.reduce((a, b) => a + b._doc.rating, 0) /
            res.data.event.rating.length
        );
      }
    });
  }, []);

  const goToAuth = () => {
    navigate(`/Authorization`);
  };

  const goToSingUp = () => {
    axios
      .post(
        "http://localhost:8080/player/post",
        { eventID: id },
        {
          headers: { token: regUser.token },
        }
      )
      .then((res) => {
        setSelectEvent({ ...selectEvent, players: res.data.players });
      });
  };

  const goToSingOut = () => {
    axios
      .delete(`http://localhost:8080/player/del?id=${id}`, {
        headers: { token: regUser.token },
      })
      .then((res) => {
        setSelectEvent({ ...selectEvent, players: res.data.players });
      });
  };

  const sendComm = () => {
    let val = newComment.split(" ").join("");
    if (newComment && newComment.length !== 0 && val.length !== 0) {
      axios
        .post(
          `http://localhost:8080/comment/post`,
          {
            eventID: id,
            description: newComment,
          },
          { headers: { token: regUser.token } }
        )
        .then((res) => {
          setSelectEvent({ ...selectEvent, comments: res.data.comments });
          setNewComment("");
        });
    }
  };

  return (
    <main className="main">
      <div className="container-event">
        <div className="image-btn">
          <div className="image-game">
            <Slider {...settings}>
              {selectEvent.games &&
                selectEvent.games.map((item) => (
                  <div key={item._id} className="imgGame-main">
                    <a
                      className="imgGame-main"
                      href={item.link}
                      key={item._id}
                      target="_blank"
                    >
                      <img
                        className="imgGame-main"
                        src={item.image}
                        alt={`event-games-${item._id}`}
                      />
                    </a>
                  </div>
                ))}
            </Slider>
          </div>

          {selectEvent.players &&
          selectEvent.result &&
          Date.parse(selectEvent.result.dateTime) >= Date.parse(now) &&
          regUser ? (
            (selectEvent.players.length || 0) < selectEvent.result.count &&
            selectEvent.players.findIndex(
              (item) => item.user._id === regUser._id
            ) >= 0 ? (
              <button
                className="sign-up-btn"
                onClick={() => {
                  goToSingOut();
                }}
              >
                Отписаться от события
              </button>
            ) : (
              (selectEvent.players.length || 0) < selectEvent.result.count &&
              selectEvent.result.autorID !== regUser._id && (
                <button
                  className="sign-up-btn"
                  onClick={() => {
                    goToSingUp();
                  }}
                >
                  Записаться на событие
                </button>
              )
            )
          ) : (
            selectEvent.result &&
            Date.parse(selectEvent.result.dateTime) >= Date.parse(now) && (
              <button
                className="sign-up-btn"
                onClick={() => {
                  goToAuth();
                }}
              >
                Записаться на событие
              </button>
            )
          )}
        </div>
        {selectEvent.result && (
          <div className="description">
            <h3>{selectEvent.result.name}</h3>
            <p>{selectEvent.result.description}</p>
            <p>
              Игры:{" "}
              {selectEvent.games &&
                selectEvent.games.map((elem, index) => (
                  <span key={index}>{elem.name} </span>
                ))}
            </p>
            <p>
              Дата и время:{" "}
              {new Date(selectEvent.result.dateTime).toLocaleString("ru-RU")}
            </p>
            <p>
              Адрес: {selectEvent.result.region}, {selectEvent.result.locality},{" "}
              {selectEvent.result.street}, {selectEvent.result.houseNumber}
            </p>
            <div className="user-info">
              <div className="img-place">
                {selectEvent.autor.avatar ? (
                  <img className="ava" src={selectEvent.autor.avatar} />
                ) : (
                  <img className="ava" />
                )}
              </div>
              <p>
                {selectEvent.autor.firstName} {selectEvent.autor.secondName}
              </p>
              <div className="rat" onClick={() => setReadReviewOpen(true)}>
                <Rating
                  name="customized-color"
                  value={totalRating}
                  precision={0.1}
                  icon={<FavoriteIcon fontSize="inherit" />}
                  emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                  readOnly
                />
              </div>
            </div>

            <div className="map-event">
              {selectEvent.result && (
                <YMaps>
                  <Map
                    className="map"
                    state={mapState}
                    controls={["zoomControl"]}
                  >
                    <ZoomControl />
                    <Placemark geometry={mapState.center} />
                  </Map>
                </YMaps>
              )}
            </div>
          </div>
        )}

        <div className="players">
          {selectEvent.players && selectEvent.result && (
            <p className="count">
              {selectEvent.players.length}/{selectEvent.result.count}
            </p>
          )}
          {selectEvent.players && (
            <div className="users">
              {selectEvent.players.length !== 0 &&
                selectEvent.players.map((elem, index) => (
                  <div key={index}>
                    {elem.user.avatar ? (
                      <img className="ava" src={elem.user.avatar} />
                    ) : (
                      <img className="ava" />
                    )}
                    <p>
                      {elem.user.firstName} {elem.user.secondName}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="comments">
        {selectEvent.comments && selectEvent.comments.length !== 0 && (
          <div className="comms-name">Комментарии</div>
        )}
        {selectEvent.comments &&
          selectEvent.comments.map((elem, index) =>
            regUser && elem._doc.userID === regUser._id ? (
              <div className="comment-2" key={index}>
                <div className="user-2">
                  {elem.user.avatar ? (
                    <img
                      className="ava"
                      src={elem.user.avatar}
                      alt="ava-player"
                    />
                  ) : (
                    <img className="ava" />
                  )}
                  <p>
                    {elem.user.firstName} {elem.user.secondName}
                  </p>
                </div>
                <p>{elem._doc.description}</p>
              </div>
            ) : (
              <div className="comment-1" key={index}>
                <div className="user-1">
                  {elem.user.avatar ? (
                    <img
                      className="ava"
                      src={elem.user.avatar}
                      alt="ava-comment"
                    />
                  ) : (
                    <img className="ava" />
                  )}
                  <p>
                    {elem.user.firstName} {elem.user.secondName}
                  </p>
                </div>
                <p>{elem._doc.description}</p>
              </div>
            )
          )}
        {regUser && (
          <div className="make-comment">
            <div className="user-2">
              {regUser.avatar ? (
                <img className="ava" src={regUser.avatar} alt="ava-user" />
              ) : (
                <img className="ava" />
              )}
              <p>
                {regUser.firstName} {regUser.secondName}
              </p>
            </div>
            <div className="input-btn">
              <textarea
                value={newComment}
                cols="2"
                rows="2"
                onChange={(e) => {
                  setNewComment(e.target.value);
                }}
              />
              <button
                className="send-comm"
                onClick={() => {
                  sendComm();
                }}
              >
                Отправить
              </button>
            </div>
          </div>
        )}
      </div>
      {ReadReviewOpen && (
        <ReadReview
          open={ReadReviewOpen}
          setReadReviewOpen={setReadReviewOpen}
          usersReviews={selectEvent.rating}
        />
      )}
    </main>
  );
};

export default EventPage;
