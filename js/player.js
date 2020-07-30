function timePlayPointMove(e) {
    const timeLine2 = document.getElementById('timeLinePlay2');
    timeLine2.style.opacity = 0.6;
    timeLine2.style.width = e.pageX*100/window.innerWidth + '%';
}

function timePlayPointBack() {
    const timeLine2 = document.getElementById('timeLinePlay2');
    timeLine2.style.opacity = 0;
}

function timePlayMove(e) {
    let audio = document.getElementById('audio');
    audio.currentTime = e.pageX/window.innerWidth * audio.duration;
    audio.play();
    document.getElementById('play-control').innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>'
}

// function createWave() {
//     var wavesurfer = WaveSurfer.create({
//         container: '#waveform',
//         waveColor: 'violet',
//         progressColor: 'purple'
//     });
    
//     wavesurfer.load(document.getElementById('audio').src);

//     wavesurfer.on('ready', function () {
//         wavesurfer.play();
//         wavesurfer.mute = true;
//     });
// }