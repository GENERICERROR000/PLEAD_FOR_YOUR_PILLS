const Pigpio = require('pigpio');
const Snowboy = require('snowboy');
const record = require('node-record-lpcm16');

// NOTE: -----> Setup GPIO <-----

const Gpio = Pigpio.Gpio;

// WARN: SET CORRECT PIN NUMBER
const redLed = new Gpio(8, {
	mode: Gpio.OUTPUT
});

// WARN: SET CORRECT PIN NUMBER
const greenLed = new Gpio(9, {
	mode: Gpio.OUTPUT
});

function ledOn(led) {
	led.digitalWrite(1)
}

function ledOff(led) {
	led.digitalWrite(0)
}

// servo pulses at 50Hz on the GPIO
// 0 (off), 500 (most anti-clockwise) to 2500 (most clockwise)
// pulse width in microseconds
// WARN: Set Correct number
const pulseWidthOpen = 1000;
// WARN: Set correct number
const pulseWidthClose = 2000;

// WARN: SET CORRECT PIN NUMBER
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

// NOTE: -----> Plead State <-----

var pleadsNeeded = 1;
var pleads = 0;

function receivedPlead() {
	if (pleads == pleadsNeeded) {
		handleUnlock();
	} else {
		handlePlead();
	}
}

function handleUnlock() {
	ledOn(greenLed);
	openPillBox();

	setTimeout(() => {
		ledOff(greenLed);
		closePillBox();
		resetPleads();
	}, 120000);
}

function handlePlead() {
	pleads += 1;
	ledOn(redLed);

	setTimeout(() => {
		ledOff(redLed);
	}, 1000);
}

function resetPleads() {
	pleads = 0;
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

detector.on('hotword', function (index, hotword, buffer) {
	console.log('hotword', hotword);
	receivedPlead();
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

// NOTE: -----> Start Everything <-----

// flash leds
ledOn(redLed);
ledOn(greenLed);

setTimeout(() => {
	ledOff(redLed);
	ledOff(greenLed);
}, 200);

// make sure box is closed
closePillBox();

// start listening 
listener.stream().pipe(detector);
