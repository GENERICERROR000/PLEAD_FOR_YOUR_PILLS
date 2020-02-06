// const Gpio = require('pigpio').Gpio;
const Sonus = require('sonus')

// const accessToken = process.env.REVAI_TOKEN;

const language = "en-US"
const recordProgram = "arecord"
const device = "plughw:1,0"
const hotwords = [
	{
		file: './resources/Begging.pmdl',
		hotword: 'begging'
	},
	{
		file: './resources/Die.pmdl',
		hotword: 'die'
	},
	{
		file: './resources/Give.pmdl',
		hotword: 'give'
	},
	{
		file: './resources/Have.pmdl',
		hotword: 'have'
	},
	{
		file: './resources/Help.pmdl',
		hotword: 'help'
	},
	{
		file: './resources/Let.pmdl',
		hotword: 'let'
	},
	{
		file: './resources/Life.pmdl',
		hotword: 'life'
	},
	{
		file: './resources/Live.pmdl',
		hotword: 'live'
	},
	{
		file: './resources/Need.pmdl',
		hotword: 'need'
	},
	{
		file: './resources/Please.pmdl',
		hotword: 'please'
	},
]

const sonus = Sonus.init({
	hotwords,
	language,
	recordProgram,
	device
}, {})

Sonus.start(sonus)

sonus.on('begging', (index, keyword) => console.log("begging"))
sonus.on('die', (index, keyword) => console.log("die"))
sonus.on('give', (index, keyword) => console.log("give"))
sonus.on('have', (index, keyword) => console.log("have"))
sonus.on('help', (index, keyword) => console.log("help"))
sonus.on('let', (index, keyword) => console.log("let"))
sonus.on('life', (index, keyword) => console.log("life"))
sonus.on('live', (index, keyword) => console.log("live"))
sonus.on('need', (index, keyword) => console.log("need"))
sonus.on('please', (index, keyword) => console.log("please"))

// var job;

// sendAudio();

// async function sendAudio() {
// 	console.log("Sending audio...")
// 	console.log("")

// 	job = await client.submitJobLocalFile("./tmp/pills_00.mp4");

// 	setTimeout(pollEndpoint, 1500, job.id);
// }

// // or from audio data, the filename is optional
// // const stream = fs.createReadStream("./path/to/file.mp3");
// // var job = await client.submitJobAudioData(stream, "file.mp3");

// // 2. Check if job complete
// // 	  Yes: move on to 3
// //    No: Keep polling
// // var jobDetails = await client.getJobDetails(job.id);

// async function pollEndpoint(jobId) {
// 	console.log("Polling...")
// 	console.log("")

// 	let jobDetails = await client.getJobDetails(jobId);

// 	if (jobDetails.status == "transcribed") {
// 		getText(jobId);
// 	} else {
// 		setTimeout(pollEndpoint, 1500, jobId);
// 	}
// }

// async function getText(jobId) {
// 	console.log("Here's DATA!!!")
// 	console.log("")

// 	let transcriptObject = await client.getTranscriptObject(job.id);

// 	console.log(transcriptObject.monologues[0].elements);
// }