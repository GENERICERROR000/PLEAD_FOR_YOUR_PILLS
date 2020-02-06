const Snowboy = require('snowboy');
// const Gpio = require('pigpio').Gpio;
const record = require('node-record-lpcm16');

const Detector = Snowboy.Detector;
const Models = Snowboy.Models;

const models = new Models();

const hotwords = [
	'begging',
	'die',
	'give',
	'have',
	'help',
	'let',
	'life',
	'live',
	'need',
	'please'
]

hotwords.forEach(hotword => {
	models.add({
		file: "resources/models/" + hotword + ".pmdl",
		sensitivity: '0.5',
		hotwords: hotword
	})
})

const detector = new Detector({
	resource: "node_modules/snowboy/resources/common.res",
	models: models,
	audioGain: 2.0,
	language: 'en-US'
});

detector.on('silence', function () {
	console.log('silence');
});

detector.on('sound', function (buffer) {
	// <buffer> contains the last chunk of the audio that triggers the "sound"
	// event. It could be written to a wav stream.
	console.log('sound');
});

detector.on('error', function () {
	console.log('error');
});

detector.on('hotword', function (index, hotword, buffer) {
	// <buffer> contains the last chunk of the audio that triggers the "hotword"
	// event. It could be written to a wav stream. You will have to use it
	// together with the <buffer> in the "sound" event if you want to get audio
	// data after the hotword.
	// console.log(buffer);
	console.log('hotword', index, hotword);
});

const listener = record.record({
	threshold: 0,
	verbose: true,
	recorder: "arecord",
	device: "plughw:1,0",
	silence: '1.0',
	endOnSilence: true
});

listener.stream().pipe(detector);

// const language = "en-US"
// const recordProgram = "arecord"
// const device = "plughw:1,0"

// const sonus = Sonus.init({
// 	hotwords,
// 	language,
// 	recordProgram,
// 	device
// }, {})

// Sonus.start(sonus)

// sonus.on('begging', (index, keyword) => console.log("begging"))
// sonus.on('die', (index, keyword) => console.log("die"))
// sonus.on('give', (index, keyword) => console.log("give"))
// sonus.on('have', (index, keyword) => console.log("have"))
// sonus.on('help', (index, keyword) => console.log("help"))
// sonus.on('let', (index, keyword) => console.log("let"))
// sonus.on('life', (index, keyword) => console.log("life"))
// sonus.on('live', (index, keyword) => console.log("live"))
// sonus.on('need', (index, keyword) => console.log("need"))
// sonus.on('please', (index, keyword) => console.log("please"))
