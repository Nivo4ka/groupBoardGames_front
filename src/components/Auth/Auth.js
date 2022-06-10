import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.scss";
import {
  FormControl,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import authimg from "../../images/streamline-icon-high-five_400x400-removebg-preview.png";

const Auth = () => {
  const [authUser, setAuthUser] = useState({
    login: "",
    password: "",
    showPassword: false,
  });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
  });
  let navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({
      open: false,
      text: "",
    });
  };

  const checkUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (
      formData.get("input-login").length !== 0 &&
      formData.get("input-password").length !== 0
    ) {
      const { login, password } = authUser;
      await axios
        .post("http://localhost:8080/user/get", {
          login,
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
          setAuthUser({
            login: "",
            password: "",
            showPassword: false,
          });
          navigate("/");
        })
        .catch((err) => {
          if (err.response)
            setAlert({
              open: true,
              text:
                err.response.status === 401
                  ? "Пользователя с таким логином не существует"
                  : err.response.status === 409
                  ? "Введен неверный пароль"
                  : "",
            });
        });
    } else {
      setAlert({
        open: true,
        text: "Вводимые значения некорректны, должны быть заполнены все поля",
      });
    }
  };

  return (
    <main className="main">
      <div className="container-auth">
        <div className="main-auth">
          <div className="main-auth-field">
            <h2>Войти в систему</h2>
            <form onSubmit={checkUser}>
              <div className="input-form-auth">
                <div className="auth-div-login">
                  <TextField
                    id="input-login"
                    name="input-login"
                    label="Логин"
                    type="text"
                    variant="outlined"
                    value={authUser.login}
                    onChange={(e) =>
                      setAuthUser({ ...authUser, login: e.target.value })
                    }
                  />
                </div>

                <FormControl
                  className="root margin textField"
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Пароль
                  </InputLabel>
                  <OutlinedInput
                    id="input-password"
                    name="input-password"
                    type={authUser.showPassword ? "text" : "password"}
                    value={authUser.password}
                    onChange={(e) =>
                      setAuthUser({ ...authUser, password: e.target.value })
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setAuthUser({
                              ...authUser,
                              showPassword: !authUser.showPassword,
                            })
                          }
                          edge="end"
                        >
                          {authUser.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="пароль"
                  />
                  <button className="button-auth">Войти</button>
                </FormControl>
              </div>
              <div
                className="auth-text"
                onClick={() => navigate("/Registration")}
              >
                Зарегистрироваться
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
        <img src={authimg} alt="people-default"></img>
      </div>
    </main>
  );
};

export default Auth;
