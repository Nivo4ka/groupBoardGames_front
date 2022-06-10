import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Snackbar,
} from "@mui/material";
import XMLData from "../../db.xml";
import XMLParser from "react-xml-parser";
import "./SearchArea.scss";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

const SearchArea = ({ sorting, setSorting, setEvents }) => {
  const [games, setGames] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [xml, setXml] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    text: "",
  });

  let regUser = JSON.parse(localStorage.getItem("user"));

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
        }
        if (regUser)
          qwerty.children.forEach((elem) => {
            if (elem.attributes.name === regUser.region) {
              let arr = [];
              elem.children.forEach((el) => {
                arr.push(el.attributes.name);
              });
              arr.sort();
              setCities([...arr]);
            }
          });
      });

    axios.get("http://localhost:8080/game/get").then((res) => {
      setGames(res.data.games);
    });

    if (regUser) {
      setSorting({
        ...sorting,
        region: regUser.region,
        locality: regUser.locality,
      });
    }
  }, []);

  const changeRegion = (e) => {
    e.preventDefault();
    setSorting({ ...sorting, region: e.target.value, locality: "" });
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

  const onChangeDateBefore = (e) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Date.parse(e.target.value) >= today) {
      setSorting({ ...sorting, dateBefore: e.target.value, dateAfter: "" });
    } else {
      setAlert({
        open: true,
        text: "Дата должна быть больше текущей",
      });
    }
  };

  const onChangeDateAfter = (e) => {
    const today = Date.now();
    if (
      Date.parse(e.target.value) >= today &&
      e.target.value >= sorting.dateBefore
    ) {
      setSorting({ ...sorting, dateAfter: e.target.value });
    } else {
      setAlert({
        open: true,
        text: "Дата должна быть больше текущей и даты начала периода",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ open: false, text: "" });
  };

  const onSortEvents = () => {
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
  };

  const onChangeDirection = (dir) => {
    setSorting({ ...sorting, direction: dir });
    axios
      .post("http://localhost:8080/event/get", {
        games: sorting.games,
        region: sorting.region,
        locality: sorting.locality,
        dateBefore: sorting.dateBefore,
        dateAfter: sorting.dateAfter,
        direction: dir,
      })
      .then((res) => {
        setEvents(res.data.events);
      });
  };

  return (
    <div className="search-block">
      <Paper elevation={0} className="panel-search">
        <div className="areas">
          <div className="event-div">
            <Autocomplete
              multiple
              id="tags-outlined"
              options={games}
              getOptionLabel={(option) => option.name}
              value={sorting.games}
              filterSelectedOptions
              renderInput={(params) => <TextField {...params} label="Игры" />}
              onChange={(e, newValue) => {
                setSorting({
                  ...sorting,
                  games: [...newValue],
                });
              }}
            />
          </div>

          <FormControl className="formControl1" variant="outlined">
            <InputLabel id="demo-simple-select-label">Регион</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select-1"
              value={sorting.region}
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
            disabled={!sorting.region}
          >
            <InputLabel id="demo-simple-select-label">
              Населенный пункт
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select-2"
              value={sorting.locality}
              label="Населенный пункт"
              onChange={(e) =>
                setSorting({ ...sorting, locality: e.target.value })
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

          <div className="event-div">
            <TextField
              id="input-date-before"
              name="input-date-before"
              label="Начало периода"
              variant="outlined"
              type="date"
              className="textField"
              InputLabelProps={{
                shrink: true,
              }}
              value={sorting.dateBefore}
              onChange={(e) => onChangeDateBefore(e)}
            />
          </div>

          <div className="event-div">
            <TextField
              disabled={!sorting.dateBefore}
              id="input-date-after"
              name="input-date-after"
              label="Конец периода"
              variant="outlined"
              type="date"
              className="textField"
              InputLabelProps={{
                shrink: true,
              }}
              value={sorting.dateAfter}
              onChange={(e) => onChangeDateAfter(e)}
            />
          </div>

          <div className="sort-div">
            {sorting.direction === 0 ? (
              <IconButton
                className="image-btn for-click"
                title="Отсортировать по дате по возрастанию"
                onClick={() => onChangeDirection(1)}
              >
                <KeyboardArrowDownRoundedIcon />
              </IconButton>
            ) : sorting.direction === 1 ? (
              <IconButton
                className="image-btn for-click"
                title="Отсортировать по дате по убыванию"
                onClick={() => onChangeDirection(-1)}
              >
                <KeyboardArrowUpRoundedIcon />
              </IconButton>
            ) : (
              <IconButton
                className="image-btn for-click"
                title="Снять сортировку по дате"
                onClick={() => onChangeDirection(0)}
              >
                <CircleOutlinedIcon />
              </IconButton>
            )}
          </div>
        </div>

        <button
          className="search-btn"
          onClick={() => {
            onSortEvents();
          }}
        >
          Найти
        </button>
      </Paper>

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
    </div>
  );
};

export default SearchArea;
