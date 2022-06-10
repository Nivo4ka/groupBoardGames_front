import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Main from "./components/Main/Main";
import Auth from "./components/Auth/Auth";
import Reg from "./components/Reg/Reg";
import NavBar from "./components/NavBar/NavBar";
import Personality from "./components/Personality/Personality";
import Footer from "./components/Footer/Footer";
import EventPage from "./components/EventPage/EventPage";
import Games from "./components/Games/Games";
import MyEvents from "./components/MyEvents/MyEvents";
import EventsForReviews from "./components/EventsForReviews/EventsForReviews";
import PlayersEvents from "./components/PlayersEvents/PlayersEvents";

const App = () => {
  return (
    <div className="App">
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/Registration" element={<Reg />} />
        <Route path="/Authorization" element={<Auth />} />
        <Route path="/Games" element={<Games />} />
        <Route path="/MyEvents" element={<MyEvents />} />
        <Route path="/EventsForReviews" element={<EventsForReviews />} />
        <Route path="/PlayersEvents" element={<PlayersEvents />} />
        <Route path="/PersonalAccount" element={<Personality />} />
        <Route path="/EventPage/:id" element={<EventPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
