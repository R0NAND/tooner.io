import { Link } from "react-router";
import "./Navbar.css";
import "./tuning-fork.css";
import TuningFork from "../../resources/tuning-fork.svg?react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faPlayCircle } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Tooner.io</Link>
      <ul>
        <li>
          <Link to={"/tuner"}>
            <TuningFork className="tuning-fork-svg"></TuningFork>
            <span>&nbsp;Tuner</span>
          </Link>
        </li>
        <li>
          <Link to={"/tutorials"}>
            <FontAwesomeIcon icon={faPlayCircle}></FontAwesomeIcon>
            <span>&nbsp;Tutorials</span>
          </Link>
        </li>
        <li>
          <Link to={"/tabs"}>
            <FontAwesomeIcon icon={faBookOpen}></FontAwesomeIcon>
            <span>&nbsp;Tabs</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
