let mediaRecorder;
let audioChunks = [];
let recordedAudioUrl;

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
            document.getElementById('audioData').value = recordedAudioUrl; // Set audio data to a hidden input for form submission
        };
    });

document.getElementById('startRecording').addEventListener('click', function (event) {
    event.preventDefault();

    if (mediaRecorder.state === 'inactive') {
        audioChunks = [];
        mediaRecorder.start();
        document.getElementById('startRecording').textContent = 'Stop Recording';
    } else {
        mediaRecorder.stop();
        document.getElementById('startRecording').textContent = 'Record';
    }
});

document.getElementById('stopRecording').addEventListener('click', function (event) {
    event.preventDefault(); // Prevents form submission

    if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        document.getElementById('startRecording').textContent = 'Record';
    }
});

document.getElementById('uploadedAudioFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const uploadedAudioUrl = URL.createObjectURL(file);
    document.getElementById('uploadedAudio').src = uploadedAudioUrl;
    document.getElementById('uploadedAudio').style.display = 'block';
    document.getElementById('audioData').value = uploadedAudioUrl; // Set audio data to a hidden input for form submission
});


