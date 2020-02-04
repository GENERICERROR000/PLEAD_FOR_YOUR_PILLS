const RevAiApiClient = require('revai-node-sdk').RevAiApiClient;
// const Gpio = require('pigpio').Gpio;

const accessToken = process.env.REVAI_TOKEN;
const client = new RevAiApiClient(accessToken);

// 1.Submit file
// you can submit a local file
// var job = await client.submitJobLocalFile("./tmp/pills_00.mp4");

var job;

sendAudio();

async function sendAudio() {
	console.log("Sending audio...")
	console.log("")

	job = await client.submitJobLocalFile("./tmp/pills_00.mp4");

	setTimeout(pollEndpoint, 1500, job.id);
}

// or from audio data, the filename is optional
// const stream = fs.createReadStream("./path/to/file.mp3");
// var job = await client.submitJobAudioData(stream, "file.mp3");

// 2. Check if job complete
// 	  Yes: move on to 3
//    No: Keep polling
// var jobDetails = await client.getJobDetails(job.id);

async function pollEndpoint(jobId) {
	console.log("Polling...")
	console.log("")

	let jobDetails = await client.getJobDetails(jobId);

	if (jobDetails.status == "transcribed") {
		getText(jobId);
	} else {
		setTimeout(pollEndpoint, 1500, jobId);
	}
}

// 3. Get transcript
// as plain text
// var transcriptText = await client.getTranscriptText(job.id);

// or as an object
// var transcriptObject = await client.getTranscriptObject(job.id);

async function getText(jobId) {
	console.log("Here's DATA!!!")
	console.log("")

	let transcriptObject = await client.getTranscriptObject(job.id);

	console.log(transcriptObject.monologues[0].elements);
}