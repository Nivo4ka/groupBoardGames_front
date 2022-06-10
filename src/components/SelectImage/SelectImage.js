import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import "./SelectImage.scss";

const SelectImage = ({ open, loadImg, handleClose, src, alt }) => {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Загрузить изображение?</DialogTitle>
      <DialogContent>
        <img className="ava-select" src={src} alt={alt}></img>
      </DialogContent>
      <DialogActions>
        <button className="cancel-btn" onClick={() => handleClose()}>
          Отмена
        </button>
        <button className="agree-btn" onClick={() => loadImg()}>
          Сменить аватар
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectImage;
