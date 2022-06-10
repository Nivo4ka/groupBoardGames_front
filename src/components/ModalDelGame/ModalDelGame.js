import React from "react";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import "./ModalDelGame.scss";

const ModalDelGame = ({ delGame, modalDelOpen, handleCloseDel }) => {
  return (
    <Dialog
      open={modalDelOpen.open}
      onClose={() => handleCloseDel()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Вы уверены, что хотите удалить данную игру?
      </DialogTitle>
      <DialogActions>
        <button className="cancel-btn" onClick={() => handleCloseDel()}>
          Отмена
        </button>
        <button className="agree-btn" onClick={() => delGame(modalDelOpen.id)}>
          Удалить
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDelGame;
