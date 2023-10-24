import whisper
from diarization import diarize


def easy_transcribe(file, diary):
    model = whisper.load_model('base')
    result = model.transcribe(file, verbose=False)
    segments = result['segments']
    text = []
    for index, segment in enumerate(segments):
        start = segment['start']
        end = segment['end']
        transcription = segment['text']

        # slight bug here - sometimes, if the speaker pauses for too long,
        # whisper recognizes it as a separate segment, while pyannote doesn't
        # because of this, sometimes, there will be a mismatch in the speakers
        # idea to fix: pass times from diarization, compare and concatenate if necessary
        if index < len(diary):
            speaker = str('Speaker ' + str(diary[index]))
        else:
            speaker = str('Speaker Unidentified')
        text.append(f'{speaker}:\n{start} --> {end}: {transcription}')
    formatted_text = '\n'.join(text)
    return formatted_text
