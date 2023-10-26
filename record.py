import pyaudio
import wave
import io

frames = []
p = None
stream = None


def start_recording():
    global p, stream, frames
    frames = []
    p = pyaudio.PyAudio()
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 44100

    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    while True:
        data = stream.read(CHUNK)
        frames.append(data)


def stop_recording():
    global p, stream, frames
    stream.stop_stream()
    stream.close()
    p.terminate()

    output_filename = 'output.wav'
    wf = wave.open(output_filename, 'wb')
    wf.setnchannels(1)
    wf.setsampwidth(pyaudio.PyAudio().get_sample_size(pyaudio.paInt16))
    wf.setframerate(44100)
    wf.writeframes(b''.join(frames))
    wf.close()