let mediaRecorder;
let audioChunks = [];
let timerInterval;
let timerSeconds = 0;
let recordedAudioUrl = null; // Variable to store recorded audio URL

function startRecording() {
    audioChunks = [];
    timerSeconds = 0;
    updateTimerDisplay();

    // Start recording audio
    mediaRecorder.start();
    timerInterval = setInterval(function () {
        timerSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopRecording() {
    mediaRecorder.stop();
    clearInterval(timerInterval);
    updateTimerDisplay();
}

function updateTimerDisplay() {
    let minutes = Math.floor(timerSeconds / 60);
    let seconds = timerSeconds % 60;
    document.getElementById('stopwatch').textContent = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function (event) {
            audioChunks.push(event.data);
        };
        mediaRecorder.onstop = function () {
            let audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            recordedAudioUrl = URL.createObjectURL(audioBlob);
            document.getElementById('audioPlayer').src = recordedAudioUrl;
            document.getElementById('audioPlayer').style.display = 'block';
            document.getElementById('downloadLink').href = recordedAudioUrl;
            document.getElementById('downloadLink').download = 'recorded_audio.wav';
            document.getElementById('downloadLink').style.display = 'block';
            document.getElementById('audioData').value = recordedAudioUrl;
        };
    });

document.getElementById('startRecording').addEventListener('click', function (event) {
    event.preventDefault();

    // Check if mediaRecorder is not yet defined or in inactive state
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        startRecording();
        document.getElementById('startRecording').textContent = 'Stop Recording';
    } else {
        stopRecording();
        document.getElementById('startRecording').textContent = 'Start Recording';
    }
});
