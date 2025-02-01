import React, { useState } from "react";
import Tuner from "../components/tuner/Tuner";
import { InstrumentEnum } from "../components/tuner/Tuner";
import "./TunerPage.css";
import tunings from "../resources/tunings.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSave, faX } from "@fortawesome/free-solid-svg-icons";

const TunerPage = () => {
  const [tuning, setTuning] = useState(tunings.guitar[0].notes);
  return (
    <div className="tuner-page">
      <table className="tuning-table">
        <tbody>
          {tunings.guitar.map((tuning, i) => {
            return (
              <tr className="tuning-table-row" key={tuning.name}>
                <td>
                  <button className="tuning-table-button">
                    <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
                  </button>
                </td>
                <td style={{ width: "20em", height: "2em" }}>
                  <div contentEditable>{tuning.name}</div>
                  <div style={{ fontSize: "0.61em" }}>
                    {tuning.notes.toString()}
                  </div>
                </td>
                <td>
                  <button
                    className="tuning-table-button"
                    onClick={() => {
                      setTuning(tuning.notes);
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
                  </button>
                </td>
              </tr>
            );
          })}
          <tr>
            <td style={{ textAlign: "center" }}>
              <button>
                <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
              </button>
            </td>
          </tr>
          <tr>
            <td>
              {/* <button>
                <FontAwesomeIcon icon={faSave}></FontAwesomeIcon>
              </button> */}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <Tuner instrument={InstrumentEnum.guitar} tuning={tuning}></Tuner>
    </div>
  );
};

export default TunerPage;
