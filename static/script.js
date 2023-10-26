document.addEventListener('DOMContentLoaded', function() {

    let rec;
    let audioChunks = [];
    let audioPlayer = document.getElementById('audioPlayer');
    let playButton = document.getElementById('playButton');
    let audioDataInput = document.getElementById('audioData');

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            rec = new MediaRecorder(stream);

            rec.ondataavailable = e => {
                audioChunks.push(e.data);
            };

            rec.onstop = () => {
                let blob = new Blob(audioChunks, { type: 'audio/wav' });
                let audioDataUrl = URL.createObjectURL(blob);
                audioDataInput.value = audioDataUrl;

                // Set the audio source for playback
                audioPlayer.src = audioDataUrl;
                playButton.disabled = false;

                // Create a download button
                let downloadButton = document.createElement('button');
                downloadButton.innerHTML = 'Download Recorded Audio';

                // Add click event listener to the download button
                downloadButton.addEventListener('click', function() {
                    // Create a temporary anchor element and trigger the download
                    let tempAnchor = document.createElement('a');
                    tempAnchor.href = audioDataUrl;
                    tempAnchor.download = 'recorded_audio.wav';
                    tempAnchor.click();

                    sendData(blob);
                });

                // Append the download button to a container element
                let downloadContainer = document.getElementById('downloadContainer');
                downloadContainer.innerHTML = ''; // Clear previous download buttons
                downloadContainer.appendChild(downloadButton);
            };




            document.getElementById('startRecording').addEventListener('click', () => {
                audioChunks = [];
                rec.start();
                document.getElementById('stopRecording').disabled = false;
                document.getElementById('startRecording').disabled = true;
            });

            document.getElementById('stopRecording').addEventListener('click', () => {
                rec.stop();
                document.getElementById('startRecording').disabled = false;
                document.getElementById('stopRecording').disabled = true;
            });
        })
        .catch(err => {
            console.error('Error accessing the microphone:', err);
        });

    playButton.addEventListener('click', () => {
        // Decode base64 data and play it
        let audioDataUrl = audioDataInput.value;
        let audioBlob = dataURItoBlob(audioDataUrl);
        let audioUrl = URL.createObjectURL(audioBlob);
        let audio = new Audio(audioUrl);
        audio.play();
    });

    function dataURItoBlob(dataURI) {
        // Convert base64 data to a blob
        let byteString = atob(dataURI.split(',')[1]);
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'audio/wav' });
    }

    function sendData(data) {
        var form = new FormData();
        form.append('file', data, 'data.wav');
        form.append('title', 'data.wav');
        //Chrome inspector shows that the post data includes a file and a title.
        $.ajax({
            type: 'POST',
            url: '/save-record',
            data: form,
            cache: false,
            processData: false,
            contentType: false
        }).done(function(data) {
            console.log(data);
        });
    }
    // Assume transcriptionText contains the transcription data
    let transcriptionText = "Your transcription text here";

    // Format the transcription text with CSS classes
    transcriptionText = transcriptionText.replace(/(Speaker \d+:)\n(\d+\.\d+ --> \d+\.\d+: .+)/g, '<div class="transcription-line"><span class="speaker">$1</span><span class="timestamp">$2</span></div>');

    // Set the formatted text to the transcriptionResult element
    document.getElementById('transcriptionResult').innerHTML = transcriptionText;

})
