import { InstrumentEnum } from "../components/tuner/Tuner";

export interface Tuning {
  instrument: InstrumentEnum;
  name: string;
  notes: string[];
}
