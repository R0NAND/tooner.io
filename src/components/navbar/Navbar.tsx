import { Link } from "react-router";
import "./Navbar.css";
import "./tuning-fork.css";
import TuningFork from "../../resources/tuning-fork.svg?react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faPersonChalkboard,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" style={{ fontSize: "1.61em" }}>
        Tooner.io
      </Link>
      <ul className="navbar-ul">
        <li>
          <Link to={"/tuner"}>
            <TuningFork className="tuning-fork-svg"></TuningFork>{" "}
            <span>Tuner</span>
          </Link>
        </li>
        <li>
          <Link to={"/tutorials"}>
            <FontAwesomeIcon icon={faPersonChalkboard}></FontAwesomeIcon>{" "}
            <span>Tutorials</span>
          </Link>
        </li>
        <li>
          <Link to={"/tabs"}>
            <FontAwesomeIcon icon={faBookOpen}></FontAwesomeIcon>{" "}
            <span>Tabs</span>
          </Link>
        </li>
      </ul>
      <Link to={"/sandbox"}>
        <FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon>{" "}
        <span>About</span>
      </Link>
    </nav>
  );
};

export default Navbar;
