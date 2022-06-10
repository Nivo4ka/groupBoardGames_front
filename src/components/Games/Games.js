import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconButton, Snackbar } from "@mui/material";
import Paper from "@mui/material/Paper";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import "./Games.scss";
import AddGame from "../AddGame/AddGame";
import ModalDelGame from "../ModalDelGame/ModalDelGame";

const Games = () => {
  let regUser = JSON.parse(localStorage.getItem("user"));
  const [addGameOpen, setAddGameOpen] = useState({
    open: false,
    toChange: false,
  });
  const [modalDelOpen, setModalDelOpen] = useState({ open: false, id: "" });
  const [games, setGames] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    text: "",
  });
  const [changeGame, setChangeGame] = useState({
    _id: "",
    image: "",
    name: "",
    link: "",
    minPersons: "",
    maxPersons: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/game/get", {
        headers: {
          token: JSON.parse(localStorage.getItem("user")).token,
        },
      })
      .then((res) => {
        setGames(res.data.games);
      });
  }, []);

  const goToChangeGame = (elem) => {
    setAddGameOpen({
      open: true,
      toChange: true,
    });
    setChangeGame(elem);
  };

  const goToAddGame = (elem) => {
    setAddGameOpen({
      open: true,
      toChange: false,
    });
  };

  const saveGame = (e) => {
    if (
      changeGame.image &&
      changeGame.name &&
      changeGame.maxPersons &&
      changeGame.minPersons
    ) {
      if (addGameOpen.toChange) {
        axios
          .patch(
            "http://localhost:8080/game/patch",
            {
              _id: changeGame._id,
              image: changeGame.image,
              name: changeGame.name,
              maxPersons: changeGame.maxPersons,
              minPersons: changeGame.minPersons,
              link: changeGame.link,
            },
            {
              headers: {
                token: regUser.token,
              },
            }
          )
          .then((res) => {
            setGames(res.data.games);
            handleClose();
          });
      } else {
        axios
          .post(
            "http://localhost:8080/game/post",
            {
              image: changeGame.image,
              name: changeGame.name,
              maxPersons: changeGame.maxPersons,
              minPersons: changeGame.minPersons,
              link: changeGame.link,
            },
            {
              headers: {
                token: regUser.token,
              },
            }
          )
          .then((res) => {
            setGames(res.data.games);
            handleClose();
          })
          .catch((err) => {
            setAlert({
              open: true,
              text:
                err.response.status === 421
                  ? "Игра с таким названием уже существует"
                  : "",
            });
          });
      }
    } else {
      setAlert({
        open: true,
        text: "Должны быть заполнены поля ссылки на картинку, максимальное и минимальное количество человек",
      });
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
    setChangeGame({
      _id: "",
      image: "",
      name: "",
      link: "",
      minPersons: "",
      maxPersons: "",
    });
    setAddGameOpen({
      open: false,
      toChange: false,
    });
  };

  const delGame = async (_id) => {
    await axios
      .delete(`http://localhost:8080/game/del?_id=${_id}`, {
        headers: {
          token: regUser.token,
        },
      })
      .then((res) => {
        setGames(res.data.games);
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
            <p>Игры</p>
          </div>
          <button className="btn-add-game" onClick={() => goToAddGame()}>
            +
          </button>
        </div>
        <div className="list-games">
          {games &&
            games.length !== 0 &&
            games.map((elem, index) => (
              <Paper key={index} elevation={0} className="panel-game">
                <div className="up-panel">
                  <IconButton
                    className="image-btn"
                    onClick={() => goToChangeGame(elem)}
                  >
                    <EditIcon />
                  </IconButton>
                  <h4 className="name-game">{elem.name}</h4>
                  <IconButton
                    className="image-btn"
                    onClick={() =>
                      setModalDelOpen({ open: true, id: elem._id })
                    }
                  >
                    <ClearIcon />
                  </IconButton>
                </div>

                <a href={elem.link} target="_blank">
                  <img
                    className="imgGame-game"
                    src={elem.image}
                    alt={`link-game-${elem._id}`}
                  ></img>
                </a>
                <div>
                  <div>Минимальное количество человек: {elem.minPersons}</div>
                  <div>Максимальное количество человек: {elem.maxPersons}</div>
                </div>
              </Paper>
            ))}
        </div>
        {addGameOpen.open && (
          <AddGame
            addGameOpen={addGameOpen}
            saveGame={saveGame}
            handleClose={handleClose}
            setAddGame={setChangeGame}
            addGame={changeGame}
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
        <ModalDelGame
          delGame={delGame}
          modalDelOpen={modalDelOpen}
          handleCloseDel={handleCloseDel}
        />
      )}
    </main>
  );
};

export default Games;
