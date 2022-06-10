import React from "react";
import "./Footer.scss";
import round from "../../images/round.svg";
import fourx from "../../images/fourx.svg";

const Footer = () => {
  return (
    <footer className="foot">
      <img src={round} alt="round"></img>
      <p>
        “Group Board Games” ©copyright <br />
        Выполнила студентка ЮФУ группы КТбо4-8 <br />
        Деревянко Олеся Анатольевна
      </p>
      <img src={fourx} alt="fourx"></img>
    </footer>
  );
};

export default Footer;
