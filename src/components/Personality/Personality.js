import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Personality.scss";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Rating from "@mui/material/Rating";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import womanimg from "../../images/streamline-icon-success_400x400-removebg-preview.png";
import defimg from "../../images/Default.png";
import SelectImage from "../SelectImage/SelectImage";
import ReadReview from "../ReadReview/ReadReview";
import ChangeInfo from "../ChangeInfo/ChangeInfo";

const Personality = () => {
  const [SelectImageOpen, setSelectImageOpen] = useState(false);
  const [ChangeInfoOpen, setChangeInfoOpen] = useState(false);
  const [ReadReviewOpen, setReadReviewOpen] = useState(false);
  const [{ alt, src, file }, setImg] = useState({
    src: "",
    alt: "your image",
    file: null,
  });
  const [alert, setAlert] = useState({
    open: false,
    text: "",
  });
  const [chnUser, setchnUser] = useState({
    name: "",
    email: "",
    region: "",
    locality: "",
  });
  const [totalRating, setTotalRating] = useState(0);

  let regUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (regUser.rating && regUser.rating.length)
      setTotalRating(
        regUser.rating.reduce((a, b) => a + b._doc.rating, 0) /
          regUser.rating.length
      );
  }, []);

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        src: URL.createObjectURL(e.target.files[0]),
        alt: e.target.files[0].name,
        file: e.target.files[0],
      });
      setSelectImageOpen(true);
    }
  };

  const loadImg = () => {
    const formData = new FormData();
    formData.append("img", file);
    axios
      .patch("http://localhost:8080/user/patch/avatar", formData, {
        headers: {
          token: regUser.token,
        },
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
        regUser = {
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
        localStorage.setItem("user", JSON.stringify(regUser));
        handleClose();
      });
  };

  const handleClose = () => {
    setImg({
      src: "",
      alt: "your image",
      file: null,
    });
    setSelectImageOpen(false);
  };

  const saveInfo = (e) => {
    e.preventDefault();
    let arrName = chnUser.name.split(" ");
    if (arrName[0] && arrName[1] && chnUser.region && chnUser.locality) {
      axios
        .patch(
          "http://localhost:8080/user/patch",
          {
            firstName: arrName[1],
            secondName: arrName[0],
            lastName: arrName[2] || "",
            region: chnUser.region,
            locality: chnUser.locality,
          },
          {
            headers: {
              token: regUser.token,
            },
          }
        )
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
          regUser = {
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
          localStorage.setItem("user", JSON.stringify(regUser));
          handleCloseInfo();
        })
        .catch((err) => {
          setAlert({
            open: true,
            text:
              err.response.status === 409
                ? "Вводимые значения некорректны, должны быть заполнены все поля"
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

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({
      open: false,
      text: "",
    });
  };

  const goToChange = () => {
    setchnUser({
      name:
        regUser.secondName + " " + regUser.firstName + " " + regUser.lastName,
      email: regUser.email,
      region: regUser.region,
      locality: regUser.locality,
    });
    setChangeInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setchnUser({
      name: "",
      email: "",
      region: "",
      locality: "",
    });
    setChangeInfoOpen(false);
  };

  return (
    <main className="main">
      <div className="container-person">
        <div className="avatar-btn">
          {regUser.avatar ? (
            <img className="avatar" src={regUser.avatar} alt="avatar-user" />
          ) : (
            <img className="avatar" src={defimg} alt="avatar-dafault" />
          )}
          <input
            accept="image/*"
            className="input"
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => handleImg(e)}
          />
          <label htmlFor="contained-button-file">
            <span className="change-avatar-btn" role="button">
              Сменить аватар
            </span>
          </label>
        </div>
        <div className="info">
          <p>
            ФИО: {regUser.secondName} {regUser.firstName} {regUser.lastName}
          </p>
          <p>Почта: {regUser.email}</p>
          <p>Регион: {regUser.region}</p>
          <p>Населенный пункт: {regUser.locality}</p>
          <button className="btn-change-info" onClick={() => goToChange()}>
            Изменить информацию
          </button>
        </div>
        <div className="rating-btn">
          <div className="rating">
            <Rating
              name="customized-color"
              value={totalRating}
              precision={0.1}
              icon={<FavoriteIcon fontSize="inherit" />}
              emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
              readOnly
            />
          </div>
          <button
            className="btn-read-review"
            onClick={() => setReadReviewOpen(true)}
          >
            Читать отзывы
          </button>
          <img src={womanimg} className="img-pers" alt="woman-default"></img>
        </div>
      </div>
      {SelectImageOpen && (
        <SelectImage
          open={SelectImageOpen}
          loadImg={loadImg}
          handleClose={handleClose}
          src={src}
          alt={alt}
        />
      )}
      {ChangeInfoOpen && (
        <ChangeInfo
          open={ChangeInfoOpen}
          saveInfo={saveInfo}
          setchnUser={setchnUser}
          chnUser={chnUser}
          handleClose={handleCloseInfo}
        />
      )}
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
      {ReadReviewOpen && (
        <ReadReview
          open={ReadReviewOpen}
          setReadReviewOpen={setReadReviewOpen}
          usersReviews={regUser.rating}
        />
      )}
    </main>
  );
};

export default Personality;
