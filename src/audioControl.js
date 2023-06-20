let audioContext;
let audioStream;
let scriptNode;

let audioOutput;

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

// function startPlayback () {
//     navigator.mediaDevices.getUserMedia ({ audio: true })
//     .then (function (stream) {
//         audioStream = stream;
//         audioContext = new AudioContext ();
//         const input = audioContext.createMediaStreamSource (stream);

//         const bufferSize = 2048;
//         scriptNode = audioContext.createScriptProcessor (bufferSize, 1, 1);

//         scriptNode.onaudioprocess = function  (audioProcessingEvent) {
//             const inputBuffer = audioProcessingEvent.inputBuffer;
//             const outputBuffer = audioProcessingEvent.outputBuffer;

//             for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
//                 const inputData = inputBuffer.getChannelData (channel);
//                 const outputData = outputBuffer.getChannelData (channel);

//                 for (let i = 0; i < inputBuffer.length; i++) {
//                     outputData[i] = inputData[i];
//                 }
//             }
//         };

//         input.connect (scriptNode);
//         scriptNode.connect (audioContext.destination);
//     })
//     .catch  (function (err) {
//         console.log ('Ocorreu um erro ao acessar o microfone: ' + err);
//         alert ('Ocorreu um erro ao acessar o microfone: ' + err);
//     });
// }


function startPlayback() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      audioStream = stream;
      audioContext = new AudioContext();
      const input = audioContext.createMediaStreamSource(stream);

      const bufferSize = 2048;
      scriptNode = audioContext.createScriptProcessor(bufferSize, 1, 1);

      scriptNode.onaudioprocess = function(audioProcessingEvent) {
        const inputBuffer = audioProcessingEvent.inputBuffer;
        const outputBuffer = audioProcessingEvent.outputBuffer;

        for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
          const inputData = inputBuffer.getChannelData(channel);
          const outputData = outputBuffer.getChannelData(channel);

          // Passa os dados de entrada para os dados de saída (reprodução em tempo real)
          for (let i = 0; i < inputBuffer.length; i++) {
            outputData[i] = inputData[i];
          }
        }
      };

      // Conecta o input ao scriptNode
      input.connect(scriptNode);

      // Cria uma nova saída de áudio usando a API Web Audio
      audioOutput = audioContext.createMediaStreamDestination();
      scriptNode.connect(audioOutput);

      // Conecta a nova saída de áudio ao elemento de áudio
      audioPlayer.srcObject = audioOutput.stream;
      audioPlayer.play ()
    })
    .catch(function(err) {
      console.log('Ocorreu um erro ao acessar o microfone: ' + err);
    });
}

function stopPlayback () {
    audioStream.getTracks ().forEach (function (track) {
        track.stop ();
    });
    audioContext.close ();
    scriptNode.disconnect ();
    audioPlayer.srcObject = null;
}

function playbackControl () {
    navigator.vibrate (50)
    playback = !playback;
    img.src = (playback) ? 'res/microphone-slash-duotone.svg' : 'res/microphone-duotone.svg'
    label.innerHTML = (playback) ? 'Parar Reprodução' : 'Iniciar Reprodução'
    startButton.className = (playback) ? 'playing' : ''
    return (playback) ? startPlayback () : stopPlayback  ()
}
