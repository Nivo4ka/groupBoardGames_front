import React, { useEffect, useState } from "react";
import axios from "axios";
import { YMaps, ZoomControl, Map, Placemark } from "react-yandex-maps";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  InputLabel,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import "./AddEvent.scss";
import XMLData from "../../db.xml";
import XMLParser from "react-xml-parser";

const AddEvent = ({
  addEventOpen,
  saveEvent,
  handleClose,
  setAddEvent,
  addEvent,
}) => {
  let addr = "";
  const [games, setGames] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [xml, setXml] = useState({});
  const [strHouse, setStrHouse] = useState({
    street: addEvent.street,
    houseNumber: addEvent.houseNumber,
  });
  const [mapState, setMapState] = useState({
    center: [55.75326911384673, 37.62240819893403],
    zoom: 15,
    width: 350,
    height: 400,
  });
  let time = new Date().setHours(new Date().getHours() + 3);
  if (addEvent.dateTime != "") {
    time = new Date(addEvent.dateTime).setHours(
      new Date(addEvent.dateTime).getHours() + 3
    );
  }

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

        qwerty.children.forEach((elem) => {
          if (elem.attributes.name === addEvent.region) {
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
    if (addEvent.region.length !== 0)
      setMapState({
        ...mapState,
        center: [addEvent.latitude, addEvent.longitude],
      });
  }, []);

  const changeRegion = (e) => {
    e.preventDefault();

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
    addr = e.target.value;
    addr = addr.split(" ").join("+");

    if (addr.length !== 0)
      fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=d4c6f2c7-5059-4ec4-8d80-6693f0b6da6f&format=json&geocode=${addr}&results=1`
      )
        .then((response) => response.json())
        .then((data) => {
          setMapState({
            ...mapState,
            center: [
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[1],
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[0],
            ],
            zoom: 9,
          });
          setAddEvent({
            ...addEvent,
            region: e.target.value,
            latitude:
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[1],
            longitude:
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[0],
          });
        });
  };

  const changeLocality = (e) => {
    addr = addEvent.region + "+" + e.target.value;
    addr = addr.split(" ").join("+");

    if (addr.length !== 0)
      fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=d4c6f2c7-5059-4ec4-8d80-6693f0b6da6f&format=json&geocode=${addr}&results=1`
      )
        .then((response) => response.json())
        .then((data) => {
          setMapState({
            ...mapState,
            center: [
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[1],
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[0],
            ],
            zoom: 14,
          });
          setAddEvent({
            ...addEvent,
            locality: e.target.value,
            latitude:
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[1],
            longitude:
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[0],
          });
        });
  };

  const changeStreet = (e) => {
    if (e.key === "Enter") {
      addr = addEvent.region + "+" + addEvent.locality + "+" + strHouse.street;
      addr = addr.split(" ").join("+");
      fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=d4c6f2c7-5059-4ec4-8d80-6693f0b6da6f&format=json&geocode=${addr}&results=1`
      )
        .then((response) => response.json())
        .then((data) => {
          setMapState({
            ...mapState,
            center: [
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[1],
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[0],
            ],
            zoom: 17,
          });
          setAddEvent({
            ...addEvent,
            latitude:
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[1],
            longitude:
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[0],
            street: strHouse.street,
          });
        });
    }
  };

  const changeHouse = (e) => {
    if (e.key === "Enter") {
      addr =
        addEvent.region +
        "+" +
        addEvent.locality +
        "+" +
        addEvent.street +
        "+" +
        strHouse.houseNumber;
      addr = addr.split(" ").join("+");
      fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=d4c6f2c7-5059-4ec4-8d80-6693f0b6da6f&format=json&geocode=${addr}&results=1`
      )
        .then((response) => response.json())
        .then((data) => {
          setMapState({
            ...mapState,
            center: [
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[1],
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[0],
            ],
            zoom: 18,
          });
          setAddEvent({
            ...addEvent,
            latitude:
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[1],
            longitude:
              data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(
                " "
              )[0],
            houseNumber: strHouse.houseNumber,
          });
        });
    }
  };

  const goToChangeCoords = async (e) => {
    const coords = e.get("coords");
    setMapState({
      ...mapState,
      center: coords,
    });

    fetch(
      `https://geocode-maps.yandex.ru/1.x/?apikey=d4c6f2c7-5059-4ec4-8d80-6693f0b6da6f&format=json&geocode=${coords[1]},${coords[0]}&results=1`
    )
      .then((response) => response.json())
      .then((data) => {
        xml.children.forEach((elem) => {
          if (
            elem.attributes.name ===
            data.response.GeoObjectCollection.featureMember[0].GeoObject
              .metaDataProperty.GeocoderMetaData.Address.Components[2].name
          ) {
            let arr = [];
            elem.children.forEach((el) => {
              arr.push(el.attributes.name);
            });
            arr.sort();
            setCities([...arr]);
          }
        });
        setAddEvent({
          ...addEvent,
          region:
            data.response.GeoObjectCollection.featureMember[0].GeoObject
              .metaDataProperty.GeocoderMetaData.Address.Components[2].name,
          locality:
            data.response.GeoObjectCollection.featureMember[0].GeoObject
              .metaDataProperty.GeocoderMetaData.Address.Components[4].name,
          street:
            data.response.GeoObjectCollection.featureMember[0].GeoObject
              .metaDataProperty.GeocoderMetaData.Address.Components[5].name,
          houseNumber:
            data.response.GeoObjectCollection.featureMember[0].GeoObject
              .metaDataProperty.GeocoderMetaData.Address.Components[6].name,
          latitude: coords[0],
          longitude: coords[1],
        });
        setStrHouse({
          street:
            data.response.GeoObjectCollection.featureMember[0].GeoObject
              .metaDataProperty.GeocoderMetaData.Address.Components[5].name,
          houseNumber:
            data.response.GeoObjectCollection.featureMember[0].GeoObject
              .metaDataProperty.GeocoderMetaData.Address.Components[6].name,
        });
      });
  };

  return (
    <Dialog
      className="game-add"
      open={addEventOpen.open}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Изменить информацию?</DialogTitle>
      <DialogContent>
        <div>
          <div className="input-form-game">
            <div>
              <div className="game-div">
                <TextField
                  id="input-name"
                  name="input-name"
                  label="Название события"
                  type="text"
                  variant="outlined"
                  value={addEvent.name}
                  onChange={(e) =>
                    setAddEvent({ ...addEvent, name: e.target.value })
                  }
                />
              </div>
              <div className="game-div">
                <TextField
                  id="input-description"
                  name="input-description"
                  label="Описание события"
                  type="text"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={addEvent.description}
                  onChange={(e) =>
                    setAddEvent({ ...addEvent, description: e.target.value })
                  }
                />
              </div>
              <div className="event-div">
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={games}
                  getOptionLabel={(option) => option.name}
                  value={addEvent.games}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} label="Игры" />
                  )}
                  onChange={(e, newValue) => {
                    setAddEvent({
                      ...addEvent,
                      games: [...newValue],
                    });
                  }}
                />
              </div>
              <div className="game-div">
                <TextField
                  id="input-count"
                  name="input-count"
                  label="Количество участников"
                  type="text"
                  variant="outlined"
                  value={addEvent.count}
                  onChange={(e) =>
                    setAddEvent({ ...addEvent, count: e.target.value })
                  }
                />
              </div>
              <div className="game-div">
                <TextField
                  id="input-dateTime"
                  name="input-dateTime"
                  label="Дата и время"
                  type="datetime-local"
                  variant="outlined"
                  value={new Date(time).toISOString().slice(0, 16)}
                  onChange={(e) => {
                    setAddEvent({ ...addEvent, dateTime: e.target.value });
                    time = new Date(addEvent.dateTime).setHours(
                      new Date(addEvent.dateTime).getHours() + 3
                    );
                  }}
                />
              </div>
              <FormControl className="formControl1" variant="outlined">
                <InputLabel id="demo-simple-select-label">Регион</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-1"
                  value={addEvent.region}
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
                disabled={!addEvent.region}
              >
                <InputLabel id="demo-simple-select-label">
                  Населенный пункт
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select-2"
                  value={addEvent.locality}
                  label="Населенный пункт"
                  onChange={(e) => changeLocality(e)}
                >
                  {cities &&
                    cities.map((elem, index) => (
                      <MenuItem key={index} value={elem}>
                        {elem}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <div className="game-div">
                <TextField
                  disabled={!addEvent.locality}
                  id="input-street"
                  name="input-street"
                  label="Улица"
                  type="text"
                  variant="outlined"
                  value={strHouse.street}
                  onChange={(e) =>
                    setStrHouse({ ...strHouse, street: e.target.value })
                  }
                  onKeyPress={(e) => changeStreet(e)}
                />
              </div>
              <div className="game-div">
                <TextField
                  disabled={!addEvent.street}
                  id="input-houseNumber"
                  name="input-houseNumber"
                  label="Номер дома"
                  type="text"
                  variant="outlined"
                  value={strHouse.houseNumber}
                  onChange={(e) =>
                    setStrHouse({ ...strHouse, houseNumber: e.target.value })
                  }
                  onKeyPress={(e) => changeHouse(e)}
                />
              </div>
              <YMaps>
                <Map
                  onClick={(e) => {
                    goToChangeCoords(e);
                  }}
                  state={mapState}
                  controls={["zoomControl"]}
                  modules={["Placemark"]}
                >
                  <ZoomControl />
                  {addEvent.latitude !== 0 && addEvent.longitude !== 0 && (
                    <Placemark
                      geometry={[addEvent.latitude, addEvent.longitude]}
                    />
                  )}
                </Map>
              </YMaps>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button className="cancel-btn" onClick={() => handleClose()}>
          Отмена
        </button>

        {addEventOpen.toChange ? (
          <button className="agree-btn" onClick={(e) => saveEvent(e)}>
            Изменить информацию
          </button>
        ) : (
          <button className="agree-btn" onClick={(e) => saveEvent(e)}>
            Создать событие
          </button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddEvent;
