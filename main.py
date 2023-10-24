from input import get_info
from diarization import diarize
from transcription import easy_transcribe
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


if __name__ == '__main__':
    info = get_info()
    path = info[0]
    speakers = info[1]
    with suppress_stdout():
        diary = diarize(path, speakers)
    print(easy_transcribe(path, diary))

# /Users/aarnavgautam/Downloads/plans.wav
