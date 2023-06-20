let audioContext;
let audioStream;
let scriptNode;

let playback = false;
let img = document.querySelector ('img');
let label = document.querySelector ('label')


const startButton = document.getElementById ('startButton');
const audioPlayer = document.getElementById ('audioPlayer');

startButton.addEventListener ('click', playbackControl);
startButton.addEventListener ('contextmenu', (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation();
        return false;
});

function startPlayback () {
    navigator.mediaDevices.getUserMedia ({ audio: true })
    .then (function (stream) {
        audioStream = stream;
        audioContext = new AudioContext ();
        const input = audioContext.createMediaStreamSource (stream);

        const bufferSize = 2048;
        scriptNode = audioContext.createScriptProcessor (bufferSize, 1, 1);

        scriptNode.onaudioprocess = function  (audioProcessingEvent) {
            const inputBuffer = audioProcessingEvent.inputBuffer;
            const outputBuffer = audioProcessingEvent.outputBuffer;

            for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                const inputData = inputBuffer.getChannelData (channel);
                const outputData = outputBuffer.getChannelData (channel);

                for (let i = 0; i < inputBuffer.length; i++) {
                    outputData[i] = inputData[i];
                }
            }
        };

        // input.connect (scriptNode);
        // scriptNode.connect (audioContext.destination);


        input.connect(scriptNode);

        audioOutput = audioContext.createMediaStreamDestination();
        scriptNode.connect(audioOutput);

        audioPlayer.srcObject = audioOutput.stream;
    })
    .catch  (function (err) {
        console.log ('Ocorreu um erro ao acessar o microfone: ' + err);
        alert ('Ocorreu um erro ao acessar o microfone: ' + err);
    });
}

function stopPlayback () {
    audioStream.getTracks ().forEach (function (track) {
        track.stop ();
    });
    audioContext.close ();
    scriptNode.disconnect ();
    startButton.disabled = false;
}

function playbackControl () {
    navigator.vibrate (50)
    playback = !playback;
    img.src = (playback) ? 'res/microphone-slash-duotone.svg' : 'res/microphone-duotone.svg'
    label.innerHTML = (playback) ? 'Parar Reprodução' : 'Iniciar Reprodução'
    startButton.className = (playback) ? 'playing' : ''
    return (playback) ? startPlayback () : stopPlayback  ()
}
