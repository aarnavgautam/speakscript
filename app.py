from flask import Flask, render_template, request, send_file
from diarization import diarize
from transcription import easy_transcribe

import os

app = Flask(__name__)


# route for home page
@app.route('/')
def index():
    # renders template for home page
    return render_template('index.html')


# route for processing date
@app.route('/process', methods=['POST'])
def process():

    path = request.form['filepath']
    speakers = int(request.form['speakers'])

    diary = diarize(path, speakers)
    transcription = easy_transcribe(path, diary)

    return render_template('index.html', transcription=transcription)


if __name__ == '__main__':
    app.run(debug=True)
