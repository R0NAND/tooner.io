import * as Pitchfinder from "pitchfinder";

class PitchAnalysis extends AudioWorkletProcessor {
    // static get parameterDescriptors() {
    //     return [{
    //         name: 'audio pitch analyzer',
    //         defaultValue: 0
    //     }];
    // }

    constructor() {
        super();
        this._sampleFrequency = 5; // times per second
        this._bufferSize = 2048;
        this._buffer = new Float32Array(this._bufferSize);
        this._isProcessingBuffer = true;
        this._pitchFinder = Pitchfinder.DynamicWavelet({sampleRate: sampleRate});
        if(sampleRate / this._sampleFrequency < this._bufferSize){
            throw new Error('Sample Frequency of ${this._sampleFrequency} HZ is too high!'); //TODO fix this string
        }
        this._bufferCount = 0;
        this._timingCount = 0; // Used to tell how much time has elapsed to maintain sampling frequency
    }

    _appendToBuffer(value) {
        for (let i = 0; i < value.length; i++) {
            this._buffer[this._bufferCount + i] = value[i]; //TODO: Check what happend is buffer size is not factor of 128
        }
        this._bufferCount += value.length;
    }

    process(inputs, outputs, parameters) {
        if(this._isProcessingBuffer){ 
            this._appendToBuffer(inputs[0][0]);
            if(this._bufferCount >= this._bufferSize){
                let pitch = this._pitchFinder(this._buffer);
                this.port.postMessage({
                    eventType: 'data',
                    frequency: pitch
                });
                this._timingCount = this._bufferCount;
                this._bufferCount = 0;
                this._isProcessingBuffer = false;
            }
            return true;
        }else{
            this._timingCount += inputs[0][0].length;
            if(this._timingCount >= sampleRate / this._sampleFrequency){
                this._timingCount = 0;
                this._isProcessingBuffer = true;
            }
        }
        return true;
    }
}

registerProcessor("PitchAnalysis", PitchAnalysis);