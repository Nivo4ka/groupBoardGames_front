import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PlayersEvents.scss";

const PlayersEvents = () => {
  let navigate = useNavigate();
  let regUser = JSON.parse(localStorage.getItem("user"));

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

  useEffect(() => {
    axios
      .get("http://localhost:8080/event/getPlayersEvents", {
        headers: {
          token: regUser.token,
        },
      })
      .then((res) => {
        setEvents(res.data.events);
      });
  }, []);

  const goToEvent = (_id) => {
    navigate(`/EventPage/${_id}`);
  };

  return (
    <main className="main">
      <div className="container-for-reviews">
        <div className="div-btn">
          <div>
            <p>Будущие события</p>
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
                    <div className="reviews-events-btn"></div>
                  </div>
                </div>
              </Paper>
            ))}
        </div>
      </div>
    </main>
  );
};

export default PlayersEvents;
