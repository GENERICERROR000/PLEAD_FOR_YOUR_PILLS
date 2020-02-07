const Pigpio = require('pigpio');
const Snowboy = require('snowboy');
const record = require('node-record-lpcm16');

// NOTE: -----> State <-----

const state = {
	pleadsNeeded: 1,
	pleads: 0
};

// NOTE: -----> Setup GPIO <-----

const Gpio = Pigpio.Gpio;

// servo pulses at 50Hz on the GPIO
// 0 (off), 500 (most anti-clockwise) to 2500 (most clockwise)
// pulse width in microseconds
const pulseWidthOpen = 1000;
const pulseWidthClose = 2000;

const motor = new Gpio(10, {
	mode: Gpio.OUTPUT
});

function openPillBox() {
	console.log('Unlocking Pill Box...');

	motor.servoWrite(pulseWidthOpen);
}

function closePillBox() {
	console.log('Locking Pill Box...');

	motor.servoWrite(pulseWidthClose);
}

// NOTE: -----> Create Listener <-----

const Models = Snowboy.Models;
const Detector = Snowboy.Detector;

const models = new Models();
const detector = new Detector({
	resource: "node_modules/snowboy/resources/common.res",
	models: models,
	audioGain: 2.0,
	language: 'en-US'
});

const hotwords = [
	['begging', "0.5"],
	['die', "0.5"],
	['give', "0.5"],
	['have', "0.5"],
	['help', "0.5"],
	['let', "0.5"],
	['life', "0.5"],
	['live', "0.5"],
	['need', "0.5"],
	['please', "0.5"]
];

hotwords.forEach(hotword => {
	models.add({
		file: "resources/models/" + hotword[0] + ".pmdl",
		sensitivity: hotword[1],
		hotwords: hotword[0]
	})
})

detector.on('silence', function () {
	console.log('silence');
});

// detector.on('sound', function (buffer) {
// 	// <buffer> contains the last chunk of the audio that triggers the "sound"
// 	// event. It could be written to a wav stream.
// 	console.log('sound');
// });

detector.on('hotword', function (index, hotword, buffer) {
	// <buffer> contains the last chunk of the audio that triggers the "hotword"
	// event. It could be written to a wav stream. You will have to use it
	// together with the <buffer> in the "sound" event if you want to get audio
	// data after the hotword.
	// console.log(buffer);
	console.log('hotword', index, hotword);
});

detector.on('error', function () {
	console.log('error');
});

const listener = record.record({
	threshold: 0,
	verbose: true,
	recorder: "arecord",
	device: "plughw:1,0",
	silence: '1.0',
	endOnSilence: true
});

// NOTE: -----> Start Listening <-----

listener.stream().pipe(detector);
