import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IconButton, Snackbar } from "@mui/material";
import Paper from "@mui/material/Paper";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import "./MyEvents.scss";
import AddEvent from "../AddEvent/AddEvent";
import ModalDelEvent from "../ModalDelEvent/ModalDelEvent";

const MyEvents = () => {
  let navigate = useNavigate();
  let regUser = JSON.parse(localStorage.getItem("user"));
  const [addEventOpen, setAddEventOpen] = useState({
    open: false,
    toChange: false,
  });
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
  const [changeEvent, setChangeEvent] = useState({
    _id: "",
    name: "",
    description: "",
    games: [],
    gameID: [],
    region: "",
    locality: "",
    street: "",
    houseNumber: "",
    latitude: 0,
    longitude: 0,
    autorID: "",
    dateTime: "",
    count: 0,
  });
  const [modalDelOpen, setModalDelOpen] = useState({ open: false, id: "" });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/event/getMyEvents", {
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

  const goToChangeEvent = (elem) => {
    setAddEventOpen({
      open: true,
      toChange: true,
    });

    setChangeEvent({
      _id: elem._doc._id,
      name: elem._doc.name,
      description: elem._doc.description,
      games: elem.games,
      gameID: [],
      region: elem._doc.region,
      locality: elem._doc.locality,
      street: elem._doc.street,
      houseNumber: elem._doc.houseNumber,
      latitude: elem._doc.latitude,
      longitude: elem._doc.longitude,
      autorID: elem._doc.autorID,
      dateTime: elem._doc.dateTime,
      count: elem._doc.count,
    });
  };

  const goToAddEvent = (elem) => {
    setAddEventOpen({
      open: true,
      toChange: false,
    });
  };

  const saveEvent = (e) => {
    e.preventDefault();
    if (changeEvent.games) {
      let arr = [];
      changeEvent.games.forEach((elem) => {
        arr.push(elem._id);
      });
      changeEvent.gameID = arr;
    }
    if (
      changeEvent.name &&
      changeEvent.description &&
      changeEvent.gameID &&
      changeEvent.region &&
      changeEvent.locality &&
      changeEvent.street &&
      changeEvent.houseNumber &&
      changeEvent.latitude &&
      changeEvent.longitude &&
      changeEvent.dateTime &&
      changeEvent.count
    ) {
      const inputDate = new Date(changeEvent.dateTime)
        .toISOString()
        .slice(0, 16);
      const currentDate = new Date().toISOString().slice(0, 16);

      if (inputDate > currentDate) {
        if (addEventOpen.toChange) {
          axios
            .patch(
              "http://localhost:8080/event/patch",
              {
                id: changeEvent._id,
                name: changeEvent.name,
                description: changeEvent.description,
                gameID: changeEvent.gameID,
                region: changeEvent.region,
                locality: changeEvent.locality,
                street: changeEvent.street,
                houseNumber: changeEvent.houseNumber,
                latitude: +changeEvent.latitude,
                longitude: +changeEvent.longitude,
                dateTime: changeEvent.dateTime,
                count: changeEvent.count,
                autorID: changeEvent.autorID,
              },
              {
                headers: {
                  token: regUser.token,
                },
              }
            )
            .then((res) => {
              setEvents(res.data.events);
              handleClose();
            });
        } else {
          axios
            .post(
              "http://localhost:8080/event/post",
              {
                name: changeEvent.name,
                description: changeEvent.description,
                gameID: changeEvent.gameID,
                region: changeEvent.region,
                locality: changeEvent.locality,
                street: changeEvent.street,
                houseNumber: changeEvent.houseNumber,
                latitude: +changeEvent.latitude,
                longitude: +changeEvent.longitude,
                dateTime: changeEvent.dateTime,
                count: changeEvent.count,
              },
              {
                headers: {
                  token: regUser.token,
                },
              }
            )
            .then((res) => {
              handleClose();
              setEvents(res.data.events);
            });
        }
      } else {
        setAlert({ open: true, text: "Дата должна быть больше текущей" });
      }
    } else {
      setAlert({ open: true, text: "Должны быть заполнены все поля" });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, text: "" });
  };

  const handleCloseDel = () => {
    setModalDelOpen({
      open: false,
      id: "",
    });
  };

  const handleClose = () => {
    setAddEventOpen({
      open: false,
      toChange: false,
    });
    setChangeEvent({
      _id: "",
      name: "",
      description: "",
      games: [],
      gameID: [],
      region: "",
      locality: "",
      street: "",
      houseNumber: "",
      latitude: 0.0,
      longitude: 0.0,
      autorID: "",
      dateTime: "",
      count: 0,
    });
  };

  const delEvent = async (_id) => {
    await axios
      .delete(`http://localhost:8080/event/del?id=${_id}`, {
        headers: {
          token: regUser.token,
        },
      })
      .then((res) => {
        setEvents(res.data.events);
        setModalDelOpen({
          open: false,
          id: "",
        });
      });
  };

  return (
    <main className="main">
      <div className="container">
        <div className="div-btn">
          <div>
            <p>Мои события</p>
          </div>
          <button className="btn-add-game" onClick={() => goToAddEvent()}>
            +
          </button>
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
                            alt={`icon-${item._id}`}
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
                    <div className="my-events-btn">
                      <IconButton
                        className="image-btn for-click"
                        onClick={() => goToChangeEvent(val)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        className="image-btn for-click"
                        onClick={() =>
                          setModalDelOpen({ open: true, id: val._doc._id })
                        }
                      >
                        <ClearIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </Paper>
            ))}
        </div>
        {addEventOpen.open && (
          <AddEvent
            addEventOpen={addEventOpen}
            saveEvent={saveEvent}
            handleClose={handleClose}
            setAddEvent={setChangeEvent}
            addEvent={changeEvent}
          />
        )}
      </div>
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
      {modalDelOpen && (
        <ModalDelEvent
          delGame={delEvent}
          modalDelOpen={modalDelOpen}
          handleCloseDel={handleCloseDel}
        />
      )}
    </main>
  );
};

export default MyEvents;
