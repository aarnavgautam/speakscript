from flask import Flask, render_template, request
from diarization import diarize
from transcription import easy_transcribe
import os
# from record import AudioRecorder

app = Flask(__name__)


# initialize the mic stuff
# audio_recorder = AudioRecorder()


# route for home page
@app.route('/')
def index():
    # renders template for home page
    return render_template('index.html')


# route for processing date
@app.route('/process', methods=['POST'])
def process():
    global path, diary
    uploaded_file = request.files['audio_file']
    if uploaded_file.filename != '':
        path = "temp.wav"
        uploaded_file.save(path)
    speakers = int(request.form['speakers'])
    if request.method == 'POST':
        diary = diarize(path, speakers)
    transcription = easy_transcribe(path, diary)
    os.remove(path)
    return render_template('index.html', transcriptionResult=transcription)


if __name__ == '__main__':
    app.run(debug=True)
