import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import "./NavBar.scss";
import logout from "../../images/logout.PNG";
import login from "../../images/login.PNG";
import house from "../../images/house.PNG";
import dices from "../../images/dices.PNG";
import cards from "../../images/cards.PNG";
import pass from "../../images/pass.PNG";
import letter from "../../images/letter.PNG";
import ticket from "../../images/ticket.PNG";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}));

const NavBar = () => {
  const [navBar, setNavBar] = useState(false);
  let navigate = useNavigate();
  let regUser = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className={navBar ? "sidebar" : "sidebar close"}>
      <header>
        <div className="image-text" onClick={(e) => setNavBar(!navBar)}>
          <span className="image">
            <p className={navBar ? "logo" : "logo mini"}>GBG</p>
          </span>
        </div>
      </header>

      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links">
            <li className="nav-link">
              <LightTooltip title="Главная">
                <a onClick={() => navigate("/")}>
                  <img src={house} className="icon" alt="icon-1"></img>
                  <span className="text nav-text">Главная</span>
                </a>
              </LightTooltip>
            </li>

            {regUser && (
              <li className="nav-link">
                <LightTooltip title="Личные данные">
                  <a onClick={() => navigate("/PersonalAccount")}>
                    <img src={pass} className="icon" alt="icon-2" />
                    <span className="text nav-text">Личные данные</span>
                  </a>
                </LightTooltip>
              </li>
            )}

            {regUser && (
              <li className="nav-link">
                <LightTooltip title="Оставить отзыв">
                  <a onClick={() => navigate("/EventsForReviews")}>
                    <img src={letter} className="icon" alt="icon-3"></img>
                    <span className="text nav-text">Оставить отзыв</span>
                  </a>
                </LightTooltip>
              </li>
            )}

            {regUser && (
              <li className="nav-link">
                <LightTooltip title="Будущие события">
                  <a onClick={() => navigate("/PlayersEvents")}>
                    <img src={ticket} className="icon" alt="icon-4"></img>
                    <span className="text nav-text">Будущие события</span>
                  </a>
                </LightTooltip>
              </li>
            )}

            {regUser && (
              <li className="nav-link">
                <LightTooltip title="Мои события">
                  <a onClick={() => navigate("/MyEvents")}>
                    <img src={dices} className="icon" alt="icon-5"></img>
                    <span className="text nav-text">Мои события</span>
                  </a>
                </LightTooltip>
              </li>
            )}

            {regUser && regUser.role === "admin" && (
              <li className="nav-link">
                <LightTooltip title="Игры">
                  <a onClick={() => navigate("/Games")}>
                    <img src={cards} className="icon" alt="icon-6"></img>
                    <span className="text nav-text">Игры</span>
                  </a>
                </LightTooltip>
              </li>
            )}
          </ul>
        </div>

        <div className="bottom">
          {!regUser ? (
            <li className="">
              <LightTooltip title="Войти">
                <a onClick={() => navigate("/Authorization")}>
                  <img src={login} className="icon" alt="icon-7"></img>
                  <span className="text nav-text">Войти</span>
                </a>
              </LightTooltip>
            </li>
          ) : (
            <li className="">
              <LightTooltip title="Выйти">
                <a
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  <img src={logout} className="icon" alt="icon-8"></img>
                  <span className="text nav-text">Выйти</span>
                </a>
              </LightTooltip>
            </li>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
