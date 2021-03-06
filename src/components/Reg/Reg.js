import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import XMLData from "../../db.xml";
import XMLParser from "react-xml-parser";
import "./Reg.scss";
import {
  FormControl,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Snackbar,
  Select,
  MenuItem,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const Reg = () => {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [xml, setXml] = useState({});
  const [regUser, setRegUser] = useState({
    login: "",
    name: "",
    email: "",
    region: "",
    city: "",
    password: "",
    showPassword: false,
  });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
  });
  let navigate = useNavigate();

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
      });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({
      open: false,
      text: "",
    });
  };

  const changeRegion = (e) => {
    e.preventDefault();
    setRegUser({ ...regUser, region: e.target.value });
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

  const checkPass = () => {
    const regexp = /((?=.*[0-9])(?=.*[a-zA-Z]).{8,})/g;
    return regexp.test(regUser.password) && !/[??-????-??]/.test(regUser.password);
  };

  const checkLogin = () => {
    return (
      (/[a-zA-Z]/.test(regUser.login) || /[0-9]/.test(regUser.login)) &&
      !/[??-????-??]/.test(regUser.login)
    );
  };

  const checkEmail = () => {
    var re = /\S+@\S+\.\S+/;
    return re.test(regUser.email) && !/[??-????-??]/.test(regUser.email);
  };

  const checkUser = async (e) => {
    e.preventDefault();
    const { login, name, email, region, city, password } = regUser;
    let arrName = name.split(" ");
    if (
      login &&
      arrName[0] &&
      arrName[1] &&
      email &&
      region &&
      city &&
      password &&
      checkPass() &&
      checkEmail() &&
      checkLogin() &&
      password.length >= 8
    ) {
      await axios
        .post("http://localhost:8080/user/post", {
          login,
          firstName: arrName[1],
          secondName: arrName[0],
          lastName: arrName[2],
          name,
          email,
          region,
          locality: city,
          password,
        })
        .then((res) => {
          const {
            token,
            _id,
            firstName,
            secondName,
            lastName,
            email,
            region,
            locality,
            avatar,
            role,
            rating,
          } = res.data;
          let user = {
            token,
            _id,
            firstName,
            secondName,
            lastName: lastName || "",
            email,
            region,
            locality,
            avatar,
            role,
            rating,
          };
          localStorage.setItem("user", JSON.stringify(user));
          setRegUser({
            login: "",
            name: "",
            email: "",
            region: "",
            city: "",
            password: "",
            showPassword: false,
          });
          navigate("/");
        })
        .catch((err) => {
          setAlert({
            open: true,
            text:
              err.response.status === 421
                ? "???????????? ?????????? ?????? ?????????? ?????? ????????????"
                : err.response.status === 409
                ? "???????????????? ???????????????? ??????????????????????, ???????????? ???????? ?????????????????? ?????? ????????"
                : "",
          });
        });
    } else {
      setAlert({
        open: true,
        text: "???????????????? ???????????????? ??????????????????????, ???????????? ???????? ?????????????????? ?????? ????????",
      });
    }
  };

  return (
    <main className="main">
      <div className="container">
        <div className="main-reg">
          <div className="main-reg-field">
            <h2>??????????????????????</h2>
            <form onSubmit={checkUser}>
              <div className="input-form-reg">
                <div className="reg-div">
                  <TextField
                    title="?????????? ???? ?????????? ?????????????????? ?????????????????????? ??????????"
                    id="input-login"
                    name="input-login"
                    label="??????????"
                    type="text"
                    variant="outlined"
                    value={regUser.login}
                    onChange={(e) =>
                      setRegUser({ ...regUser, login: e.target.value })
                    }
                  />
                </div>
                <div className="reg-div">
                  <TextField
                    title="?????????????? ?????? ?? ????????????????(?????? ??????????????) ???????????????????? ?????????????? ?????????? ????????????"
                    id="input-name"
                    name="input-name"
                    label="??????"
                    type="text"
                    variant="outlined"
                    value={regUser.name}
                    onChange={(e) =>
                      setRegUser({ ...regUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="reg-div">
                  <TextField
                    id="input-email"
                    name="input-email"
                    label="??????????"
                    type="text"
                    variant="outlined"
                    value={regUser.email}
                    onChange={(e) =>
                      setRegUser({ ...regUser, email: e.target.value })
                    }
                  />
                </div>
                <FormControl className="formControl1" variant="outlined">
                  <InputLabel id="demo-simple-select-label">??????????</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select-1"
                    value={regUser.region}
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
                  disabled={!regUser.region}
                >
                  <InputLabel id="demo-simple-select-label">
                    ???????????????????? ??????????
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select-2"
                    value={regUser.city}
                    label="???????????????????? ??????????"
                    onChange={(e) =>
                      setRegUser({ ...regUser, city: e.target.value })
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

                <FormControl
                  title="???????????? ???????????? ?????????????????? ???????? ???? 1 ?????????? ?? 1 ?????????????????? ??????????, ?????????? ???? ???????????? ???????? ???? ?????????? 8 ????????????????"
                  className="margin textField pass formControl1"
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    ????????????
                  </InputLabel>
                  <OutlinedInput
                    id="input-password"
                    name="input-password"
                    type={regUser.showPassword ? "text" : "password"}
                    value={regUser.password}
                    onChange={(e) =>
                      setRegUser({ ...regUser, password: e.target.value })
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setRegUser({
                              ...regUser,
                              showPassword: !regUser.showPassword,
                            })
                          }
                          edge="end"
                        >
                          {regUser.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="????????????"
                  />
                </FormControl>
              </div>
              <button className="button-reg">????????????????????????????????????</button>
              <div
                className="reg-text"
                onClick={() => navigate("/Authorization")}
              >
                ??????????
              </div>
            </form>

            {alert.open && (
              <Snackbar
                open={alert.open}
                autoHideDuration={13000}
                onClose={() => handleClose()}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                action={
                  <React.Fragment>
                    <CloseIcon
                      color="secondary"
                      onClick={() => handleClose()}
                    />
                  </React.Fragment>
                }
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={() => handleClose()}
                  severity="error"
                >
                  {alert.text}
                </MuiAlert>
              </Snackbar>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Reg;
