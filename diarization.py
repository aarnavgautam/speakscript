from pyannote.audio import Pipeline
import datetime
from contextlib import contextmanager
import os
import sys


@contextmanager
def suppress_stdout():
    with open(os.devnull, 'w') as devnull:
        old_stdout = sys.stdout
        sys.stdout = devnull
        try:
            yield
        finally:
            sys.stdout = old_stdout


def diarize(filepath, speakers):
    api_key = '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'
    pipeline = Pipeline.from_pretrained(
        'pyannote/speaker-diarization-3.0',
        use_auth_token=api_key
    )
    with suppress_stdout():
        diarization = pipeline(filepath, num_speakers=speakers)

    temp = str(diarization).split('\n')
    timestamps = []
    print(diarization)
    for i in temp:
        speaker_num = int(i[34:35])
        timestamps.append(speaker_num)
    return timestamps


def complicated_diarize(filepath, speakers):
    pipeline = Pipeline.from_pretrained(
        'pyannote/speaker-diarization-3.0',
        use_auth_token='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'
    )
    diarization = pipeline(filepath, num_speakers=speakers)
    temp = str(diarization).split('\n')
    timestamps = []
    for i in temp:
        start_time = i[2:14]
        end_time = i[20:32]
        speaker_num = int(i[34:35])
        start = datetime.datetime.strptime(str(start_time), '%H:%M:%S.%f')
        end = datetime.datetime.strptime(str(end_time), '%H:%M:%S.%f')
        start_milliseconds = (start.microsecond // 1000 + start.second * 1000 +
                              start.minute * 60 * 1000 +
                              start.hour * 60 * 60 * 1000)
        end_milliseconds = (end.microsecond // 1000 + end.second * 1000 +
                            end.minute * 60 * 1000 +
                            end.hour * 60 * 60 * 1000)
        timestamps.append((start_milliseconds, end_milliseconds, speaker_num))
    return timestamps


