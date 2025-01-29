import React, { useState } from "react";
import Tuner from "../components/tuner/Tuner";
import { InstrumentEnum } from "../components/tuner/Tuner";
import "./TunerPage.css";
import tunings from "../resources/tunings.json";

const TunerPage = () => {
  const [tuning, setTuning] = useState(tunings.guitar[0].notes);
  return (
    <div className="tuner-page">
      <table>
        <tbody>
          {tunings.guitar.map((tuning, i) => {
            return (
              <tr
                className="tuning-table-row"
                key={tuning.name}
                onClick={() => {
                  setTuning(tuning.notes);
                }}
              >
                <td>{tuning.name}</td>
                <td>{tuning.notes.toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Tuner instrument={InstrumentEnum.guitar} tuning={tuning}></Tuner>
    </div>
  );
};

export default TunerPage;
