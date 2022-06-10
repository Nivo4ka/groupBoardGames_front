import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import "./AddGame.scss";

const AddGame = ({
  addGameOpen,
  saveGame,
  handleClose,
  setAddGame,
  addGame,
}) => {
  return (
    <Dialog
      className="game-add"
      open={addGameOpen.open}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Изменить информацию?</DialogTitle>
      <DialogContent>
        <div>
          <div className="input-form-game">
            <div>
              <img
                className="imgGame-game"
                src={addGame.image}
              />
              <div className="game-div">
                <TextField
                  id="input-img"
                  name="input-img"
                  label="Ссылка на изображение"
                  type="text"
                  variant="outlined"
                  value={addGame.image}
                  onChange={(e) =>
                    setAddGame({ ...addGame, image: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <div className="game-div">
                <TextField
                  id="input-name"
                  name="input-name"
                  label="Название игры"
                  type="text"
                  variant="outlined"
                  value={addGame.name}
                  onChange={(e) =>
                    setAddGame({ ...addGame, name: e.target.value })
                  }
                />
              </div>
              <div className="game-div">
                <TextField
                  id="input-link"
                  name="input-link"
                  label="Ссылка"
                  type="text"
                  variant="outlined"
                  value={addGame.link}
                  onChange={(e) =>
                    setAddGame({ ...addGame, link: e.target.value })
                  }
                />
              </div>
              <div className="game-div">
                <TextField
                  id="input-minPersons"
                  name="input-minPersons"
                  label="Минимальное количество участников"
                  type="text"
                  variant="outlined"
                  value={addGame.minPersons}
                  onChange={(e) =>
                    setAddGame({ ...addGame, minPersons: e.target.value })
                  }
                />
              </div>
              <div className="game-div">
                <TextField
                  id="input-maxPersons"
                  name="input-maxPersons"
                  label="Максимальное количество участников"
                  type="text"
                  variant="outlined"
                  value={addGame.maxPersons}
                  onChange={(e) =>
                    setAddGame({ ...addGame, maxPersons: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button className="cancel-btn" onClick={() => handleClose()}>
          Отмена
        </button>

        {addGameOpen.toChange ? (
          <button className="agree-btn" onClick={(e) => saveGame(e)}>
            Изменить информацию
          </button>
        ) : (
          <button className="agree-btn" onClick={(e) => saveGame(e)}>
            Добавить игру
          </button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddGame;
