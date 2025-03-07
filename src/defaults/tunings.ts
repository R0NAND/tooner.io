import { InstrumentEnum } from "../components/tuner/Tuner";
import { Tuning } from "../types/tunings";

const defaultTunings: Tuning[] = [
  {
    instrument: InstrumentEnum.guitar,
    name: "Standard",
    notes: ["E2", "A2", "D3", "G3", "B3", "E4"],
  },
  {
    instrument: InstrumentEnum.guitar,
    name: "Drop D",
    notes: ["D2", "A2", "D3", "G3", "B3", "E4"],
  },
  {
    instrument: InstrumentEnum.guitar,
    name: "DADGAD",
    notes: ["D2", "A2", "D3", "G3", "A3", "D4"],
  },
  {
    instrument: InstrumentEnum.guitar,
    name: "Half Step Down",
    notes: ["D#2", "G#2", "C#3", "F#3", "A#3", "D#4"],
  },
  {
    instrument: InstrumentEnum.guitar,
    name: "Full Step Down",
    notes: ["D2", "G2", "C3", "F3", "A3", "D4"],
  },
  {
    instrument: InstrumentEnum.guitar,
    name: "Drop D half step down",
    notes: ["C#2", "G#2", "C#3", "F#3", "A#3", "D#4"],
  },
  {
    instrument: InstrumentEnum.guitar,
    name: "Drop D full step down",
    notes: ["C2", "G2", "C3", "F3", "A3", "D4"],
  },
  {
    instrument: InstrumentEnum.ukulele,
    name: "Standard",
    notes: ["G4", "C4", "E4", "A4"],
  },
  {
    instrument: InstrumentEnum.ukulele,
    name: "Low G",
    notes: ["G3", "C4", "E4", "A4"],
  },
  {
    instrument: InstrumentEnum.ukulele,
    name: "Half Step Down",
    notes: ["F#4", "B3", "D#4", "G#4"],
  },
  {
    instrument: InstrumentEnum.ukulele,
    name: "Full Step Down",
    notes: ["F4", "A#3", "D4", "G4"],
  },
  {
    instrument: InstrumentEnum.bass,
    name: "Standard",
    notes: ["E1", "A1", "D2", "G2"],
  },
  {
    instrument: InstrumentEnum.bass,
    name: "Half Step Down",
    notes: ["D#1", "G#1", "C#2", "F#2"],
  },
  {
    instrument: InstrumentEnum.bass,
    name: "Full Step Down",
    notes: ["D1", "G1", "C2", "F2"],
  },
  {
    instrument: InstrumentEnum.eightString,
    name: "Standard",
    notes: ["F#1", "B1", "E2", "A2", "D3", "G3", "B3", "E4"],
  },
];

export default defaultTunings;
