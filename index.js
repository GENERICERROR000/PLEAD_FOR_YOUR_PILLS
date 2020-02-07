/*
	Pill Box that you plead with to unlock and 
	get your pills.

	Uses the Snowboy to listen for 'hotwords'. It listens
	for any of the hotwords. If heard n times in 2 minutes
	the box unlocks. After 2 minutes, n is set to a random 
	number between 1 and 6 and the box locks.

	LED's flash when box turns on. When a plead is received
	but more are needed, the red LED flashes. When enough
	pleads are received, the green LED stays on for 2 minutes.

	created 02/05/2020
	Noah Kernis and Ben Moll
*/

// TODO: fn to randomly change number of pleads need
// - Between 1 and 6 
// - Resets every 2 min (unless plead heard recently?)

const Pigpio = require('pigpio');
const Snowboy = require('snowboy');
const Record = require('node-record-lpcm16');

// NOTE: -----> Setup GPIO <-----

const Gpio = Pigpio.Gpio;

const redLed = new Gpio(5, {
	mode: Gpio.OUTPUT
});

const greenLed = new Gpio(6, {
	mode: Gpio.OUTPUT
});

var ledBlinkCount = 0;
// blinkLed(redLed, 1, 500);
function blinkLed(led, numberBlinks, time, blinkCount=1) {
	// ledBlinkCount += 1;
	ledOn(led);

	setTimeout(() => {
		ledOff(led);

		// if (ledBlinkCount == blinkCount) {
		// 	ledBlinkCount = 0;
		// } else {
		// 	setTimeout(() => {
		// 		blinkLed(led, numberBlinks, time, blinkCount);
		// 	}, time);
		// }
	}, time);
}

function ledOn(led) {
	led.digitalWrite(1);
}

function ledOff(led) {
	led.digitalWrite(0);
}

// servo pulses at 50Hz on the GPIO
// 0 (off), 500 (most anti-clockwise) to 2500 (most clockwise)
// pulse width in microseconds
// WARN: Set Correct number
const pulseWidthOpen = 1000;
// WARN: Set correct number
const pulseWidthClose = 2000;

const motor = new Gpio(13, {
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

var pleadsNeeded = 3;
var pleads = 0;

function receivedPlead() {
	if (pleads == pleadsNeeded) {
		handleUnlock();
	} else {
		handlePlead();
	}
}

function handleUnlock() {
	// blinkLed(greenLed, 1, 120000)
	openPillBox();

	setTimeout(() => {
		closePillBox();
		resetPleads();
	}, 120000);
}

function handlePlead() {
	pleads += 1;

	// blinkLed(redLed, 1, 1000, 2)
}

function resetPleads() {
	pleads = 0;
}

// NOTE: -----> Create Listener <-----

const Models = Snowboy.Models;
const Detector = Snowboy.Detector;

const models = new Models();

const hotwords = [
	["begging", "0.2"],
	["die", "0.2"],
	["give", "0.2"],
	["have", "0.2"],
	["help", "0.2"],
	["let", "0.2"],
	["life", "0.2"],
	["live", "0.2"],
	["need", "0.2"],
	["please", "0.2"]
];

hotwords.forEach(hw => {
	models.add({
		file: "resources/models/" + hw[0] + ".pmdl",
		hotwords: hw[0],
		sensitivity: hw[1]
	})
})

const detector = new Detector({
	resource: "node_modules/snowboy/resources/common.res",
	language: 'en-US',
	models: models,
	audioGain: 2.0,
	applyFrontend: false
});

detector.on('silence', function () {
	console.log('silence');
});

detector.on('hotword', function (i, hw) {
	console.log('hotword', hw);
	receivedPlead();
});

detector.on('error', function () {
	console.log('error');
});

const listener = Record.record({
	threshold: 0,
	verbose: true,
	recorder: "arecord",
	device: "plughw:1,0",
	endOnSilence: false
});

// NOTE: -----> Start Everything <-----

console.log('Starting listener...');

// flash leds
blinkLed(redLed, 1, 500);
blinkLed(greenLed, 1, 500);

// make sure box is closed
closePillBox();

// start listening 
listener.stream().pipe(detector);
