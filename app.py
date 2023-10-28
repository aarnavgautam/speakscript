from flask import Flask, render_template, request
from diarization import diarize
from transcription import easy_transcribe
import os

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/process', methods=['POST'])
def process():
    global path, diary
    uploaded_file = request.files['uploadedAudioFile']
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
