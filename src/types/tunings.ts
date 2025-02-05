export interface Tunings {
  instruments: Instrument[]
}

export interface Instrument {
  name: string
  tunings: Tuning[]
}

export interface Tuning {
  name: string
  notes: string[]
}