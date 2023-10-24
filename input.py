

def get_info():
    info = []
    filepath = input('please type the path to your WAV file: ')
    while not (filepath.lower().endswith('.wav') and filepath.lower().startswith('/')):
        print('invalid input. it must be a WAV file. ')
        filepath = input('please type the path to your WAV file: ')

    while True:
        try:
            speakers = int(input('please enter how many speakers you have as an integer: '))
            break
        except ValueError:
            print('invalid input. please type an integer. ')
    print('thank you!')
    print(f'now transcribing the WAV file: {filepath}')
    info = [filepath, speakers]

    return info

