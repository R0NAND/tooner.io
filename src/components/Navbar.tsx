import React from "react";
import { Link } from "react-router";
import "./Navbar.css";
import Metronome from "./metronome/Metronome";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-ul">
        <a>Tooney.io</a>
        <li>
          <Link to={"/tuner"}>Tuner</Link>
        </li>
        <li>
          <Link to={"/tutorials"}>Tutorials</Link>
        </li>
        <li>
          <Link to={"/about"}>About</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
