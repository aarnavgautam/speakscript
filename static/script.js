let mediaRecorder;
let audioChunks = [];
let startTime;
let timerInterval;


function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = new Date(currentTime - startTime);
    const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
    const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}


navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (event) {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstart = function () {
            startTime = new Date().getTime();
            timerInterval = setInterval(updateTimer, 1000);
        };
        mediaRecorder.onstop = function () {
            clearInterval(timerInterval);
            let audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            let audioUrl = URL.createObjectURL(audioBlob);
            document.getElementById('audioPlayer').src = audioUrl;
            document.getElementById('downloadLink').href = audioUrl;
            document.getElementById('downloadLink').download = 'recorded_audio.wav';
            document.getElementById('downloadLink').style.display = 'block';
        };
    });

let recordedAudioUrl;
document.getElementById('startRecording').addEventListener('click', function (event) {
    event.preventDefault();

    if (mediaRecorder.state === 'inactive') {
        audioChunks = [];
        mediaRecorder.start();
        document.getElementById('startRecording').textContent = 'Stop Recording';
    } else {
        mediaRecorder.stop();
        document.getElementById('startRecording').textContent = 'Start Recording';
    }
});

document.getElementById('uploadedAudioFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const recordedAudioUrl = URL.createObjectURL(file);
    document.getElementById('newAudioPlayer').src = recordedAudioUrl;
    document.getElementById('uploadedAudio').src = recordedAudioUrl;
    document.getElementById('uploadedAudio').style.display = 'block';
    document.getElementById('audioData').value = recordedAudioUrl; // Set audio data to a hidden input for form submission
});
