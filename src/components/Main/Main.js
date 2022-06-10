import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Main.scss";
import SearchArea from "../SearchArea/SearchArea";

const Main = () => {
  const settings = {
    infinite: true,
    dots: false,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };
  let navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [sorting, setSorting] = useState({
    games: [],
    region: "",
    locality: "",
    dateBefore: "",
    dateAfter: "",
    direction: 0,
  });
  let regUser = JSON.parse(localStorage.getItem("user"));
  const goToEvent = (_id) => {
    navigate(`/EventPage/${_id}`);
  };

  useEffect(() => {
    if (regUser) {
      setSorting({
        ...sorting,
        region: regUser.region,
        locality: regUser.locality,
      });
      axios
        .post("http://localhost:8080/event/get", {
          games: sorting.games,
          region: regUser.region,
          locality: regUser.locality,
          dateBefore: sorting.dateBefore,
          dateAfter: sorting.dateAfter,
          direction: sorting.direction,
        })
        .then((res) => {
          setEvents(res.data.events);
        });
    } else {
      axios
        .post("http://localhost:8080/event/get", {
          games: sorting.games,
          region: sorting.region,
          locality: sorting.locality,
          dateBefore: sorting.dateBefore,
          dateAfter: sorting.dateAfter,
          direction: sorting.direction,
        })
        .then((res) => {
          setEvents(res.data.events);
        });
    }
  }, []);

  return (
    <main className="main">
      <div className="container">
        <SearchArea
          sorting={sorting}
          setSorting={setSorting}
          setEvents={setEvents}
        />
        <div className="list">
          {events &&
            events.map((val, index) => (
              <Paper
                key={index}
                className="panel-event"
                onClick={() => goToEvent(val._doc._id)}
              >
                <div className="short-event">
                  <div className="imgGame">
                    <Slider {...settings}>
                      {val.games &&
                        val.games.map((item) => (
                          <img
                            className="imgGame-main"
                            key={item._id}
                            src={item.image}
                            alt={`icon-${item._id}`}
                          />
                        ))}
                    </Slider>
                  </div>
                  <div className="main-desc">
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
                </div>
              </Paper>
            ))}
        </div>
      </div>
    </main>
  );
};

export default Main;
