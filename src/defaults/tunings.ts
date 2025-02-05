import {Tunings} from "../types/tunings"

const defaultTunings: Tunings = {
  "instruments": [
    {
      "name": "guitar",
      "tunings": [
        { "name": "Standard", "notes": ["E2", "A2", "D3", "G3", "B3", "E4"] },
        { "name": "Drop D", "notes": ["D2", "A2", "D3", "G3", "B3", "E4"] },
        { "name": "DADGAD", "notes": ["D2", "A2", "D3", "G3", "A3", "D4"] },
        {
          "name": "Half Step Down",
          "notes": ["D#2", "G#2", "C#3", "F#3", "A#3", "D#4"]
        },
        {
          "name": "Full Step Down",
          "notes": ["D2", "G2", "C3", "F3", "A3", "D4"]
        },
        {
          "name": "Drop D half step down",
          "notes": ["C#2", "G#2", "C#3", "F#3", "A#3", "D#4"]
        },
        {
          "name": "Drop D full step down",
          "notes": ["C2", "G2", "C3", "F3", "A3", "D4"]
        }
      ]
    },
    {
      "name": "ukulele",
      "tunings": [{ "name": "Standard", "notes": ["G4", "C4", "E4", "A4"] }]
    },
    {
      "name": "bass",
      "tunings": [{ "name": "Standard", "notes": ["E1", "A1", "D2", "G2"] }]
    },
    {
      "name": "8-string",
      "tunings": [
        {
          "name": "Standard",
          "notes": ["F#1", "B1", "E2", "A2", "D3", "G3", "B3", "E4"]
        }
      ]
    }
  ]
}

export default defaultTunings