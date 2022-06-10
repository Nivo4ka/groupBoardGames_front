import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import XMLData from "../../db.xml";
import XMLParser from "react-xml-parser";
import "./ChangeInfo.scss";

const ChangeInfo = ({ open, saveInfo, handleClose, setchnUser, chnUser }) => {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [xml, setXml] = useState({});

  useEffect(() => {
    axios
      .get(XMLData, {
        "Content-Type": "application/xml; charset=utf-8",
      })
      .then((response) => {
        let qwerty = new XMLParser().parseFromString(response.data);
        setXml(new XMLParser().parseFromString(response.data));
        if (qwerty) {
          qwerty.children.forEach((element) => {
            regions.push(element.attributes.name);
          });
          regions.sort();
          setRegions([...regions]);
          qwerty.children.forEach((elem) => {
            if (elem.attributes.name === chnUser.region) {
              let arr = [];
              elem.children.forEach((el) => {
                arr.push(el.attributes.name);
              });
              arr.sort();
              setCities([...arr]);
            }
          });
        }
      });
  }, []);

  const changeRegion = (e) => {
    e.preventDefault();
    setchnUser({ ...chnUser, region: e.target.value, locality: "" });
    xml.children.forEach((elem) => {
      if (elem.attributes.name === e.target.value) {
        let arr = [];
        elem.children.forEach((el) => {
          arr.push(el.attributes.name);
        });
        arr.sort();
        setCities([...arr]);
      }
    });
  };

  return (
    <Dialog
      className="change-info"
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Изменить информацию?</DialogTitle>
      <DialogContent>
        <div>
          <div className="input-form-reg">
            <div className="reg-div">
              <TextField
                title="Фамилию имя и отчество(при наличии) необходимо вводить через пробел"
                id="input-name"
                name="input-name"
                label="ФИО"
                type="text"
                variant="outlined"
                value={chnUser.name}
                onChange={(e) =>
                  setchnUser({ ...chnUser, name: e.target.value })
                }
              />
            </div>
            <div className="reg-div">
              <TextField
                disabled
                id="input-email"
                name="input-email"
                label="Почта"
                type="text"
                variant="outlined"
                value={chnUser.email}
              />
            </div>
            <FormControl className="formControl1" variant="outlined">
              <InputLabel id="demo-simple-select-label">Район</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-1"
                value={chnUser.region}
                label="Region"
                onChange={(e) => changeRegion(e)}
              >
                {regions.map((elem, index) => (
                  <MenuItem key={index} value={elem}>
                    {elem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              className="formControl1"
              variant="outlined"
              disabled={!chnUser.region}
            >
              <InputLabel id="demo-simple-select-label">
                Населенный пункт
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-2"
                value={chnUser.locality}
                label="Населенный пункт"
                onChange={(e) =>
                  setchnUser({ ...chnUser, locality: e.target.value })
                }
              >
                {cities &&
                  cities.map((elem, index) => (
                    <MenuItem key={index} value={elem}>
                      {elem}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button className="cancel-btn" onClick={() => handleClose()}>
          Отмена
        </button>

        <button className="agree-btn" onClick={(e) => saveInfo(e)}>
          Изменить информацию
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeInfo;
