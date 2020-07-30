<template>
    <div class="player-line">
        <div class="time-line" onmousemove="timePlayPointMove(event)" onmouseout="timePlayPointBack()" onclick="timePlayMove(event)">
            <div class="time-full"></div>
            <div class="time-ready" id="timeLineReady"></div>
            <div class="time-play" id="timeLinePlay">
                <span class="time-play-point"></span>
            </div>
            <div class="time-play" id="timeLinePlay2" style="opacity: .75;">
                <span class="time-play-point"></span>
            </div>
        </div>
        <div class="player">
            <div class="controls">
                <button class="control" id="prevTrack" v-on:click="prevTrack()"><i class="fa fa-step-backward" aria-hidden="true"></i></button>
                <button class="control b-main" v-on:click="play()" id="play-control"><i class="fa fa-play" aria-hidden="true"></i></button>
                <button class="control" id="nextTrack" v-on:click="nextTrack()"><i class="fa fa-step-forward" aria-hidden="true"></i></button>
                <button class="control" id="shuffle" v-on:click="shuffle()"><i class="fa fa-random" aria-hidden="true"></i></button>
                <button class="control" id="loop" v-on:click="loop()"><i class="fa fa-repeat" aria-hidden="true"></i></button>
            </div>
            <div class="track">
                <div class="track-cover center">
                    <img src="https://i.pinimg.com/originals/2c/4a/f3/2c4af3bdd98bd63311ba0390ff9828fd.png" width="40px" height="40px">
                </div>
                <span v-if="track.title" class="track-title" id="title">{{track.title}}</span>
                <span v-else class="track-title" id="title">Название композиции</span>
                <div class="track-time">
                    <span id="time-play">00:00</span>&nbsp;/&nbsp;<span id="time-full">00:00</span>
                </div>
                <span v-if="track.artist" class="track-artists" id="artist">{{track.artist}}<span v-if="track.featurings">{{track.featurings}}</span></span>
                <span v-else class="track-artists" id="artist">Исполнитель</span>
            </div>
            <div class="more-controls">
                <button class="control fav" id="favorite" v-on:click="favorite()"><i class="fa fa-heart" aria-hidden="true"></i></button>
                <button class="control" id="volume-icon" v-on:click="mute()"><i class="fa fa-volume-up" aria-hidden="true"></i></button>
                <input type="range" min="0" max="100" value="100" class="control" id="volume-slider"
                                        v-on:click="onChangeSlider()" v-on:focus="onChangeSlider()"> 
                <button class="control more" id="more" v-on:click="open_playlist()"><i class="fa fa-angle-up" aria-hidden="true"></i></button>
            </div>
        </div>
        <div class="playlist">  
            <div class="playlist-header">
                <span class="playlist-name">Playlist: {{playlist.name}} </span>
            </div>
            <div 
                v-for="playlist in playlist" 
                v-bind:key="playlist.id" 
                class="playlist-track" 
                v-on:click="play_track(playlist.index)" 
                v-bind:class="playlist.class">
                <div class="track-header">
                    <label class="track-number">#{{ playlist.index }}</label>
                    <div class="track-cover center">
                        <img src="https://i.pinimg.com/originals/2c/4a/f3/2c4af3bdd98bd63311ba0390ff9828fd.png" width="40px" height="40px">
                        <button class="cover-play"><i class="fa fa-play" aria-hidden="true"></i></button>
                    </div>
                    <span class="track-title">{{ playlist.title }}</span>
                    <span class="track-artists">{{ playlist.artist }}<span v-if="playlist.featurings">{{playlist.featurings}}</span></span>
                </div>
            </div>
        </div>        
    </div>
</template>

<script>
import {http} from '../scripts/http';
import md5 from 'js-md5';

export default {
    data() {
        return {
            track: {},
            playlist: [],
            errors: [], 
            current: null
        }
    },
    created() {
        http.get('get/lasttracks/10')
        .then(response => {
            const playlist = response.data;  
            this.playlist = playlist;
            this.playlist.name = 'newTracks';
            this.playlist.hash = md5('newTracks');
            this.tempPlalist = playlist;
            this.current = 0;
            let hash = md5(this.playlist.name);
            for (let i = 1; i <= this.playlist.length; i++) { 
                this.playlist[i-1].index = i; 
                this.playlist[i-1].hash = [this.playlist[i-1].hash, hash]; 
                if (this.playlist[i-1].featuring.length > 0) {
                    this.playlist[i-1].featurings = '';
                    for (let j = 0; j < this.playlist[i-1].featuring.length; j++)
                        this.playlist[i-1].featurings = this.playlist[i-1].featurings + ', ' + this.playlist[i-1].featuring[j];
                }
            }
            this.loadTrack();
            this.$store.commit('setPlaylist', this.playlist);
            this.$store.commit('setPlay', this.playlist[0].hash[0]);
            this.$store.commit('setHash', this.playlist.hash);
            // console.log(this.$store.getters.playlist)
        })
        .catch(e => {
            this.errors.push(e)
        });
    }, 
    methods: {
        play() {   
            const audio = document.getElementById('audio'); 
            if (audio.paused) {
                audio.play();
                document.getElementById('play-control').innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
            } else {
                audio.pause();
                document.getElementById('play-control').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
            }
        },
        play_track(index) {
            index--;
            if(index == this.current) { this.play(); return; }
            const audio = document.getElementById('audio');
            this.playlist[this.current].class = null;
            this.playlist[index].class = 'tr-active'; 
            this.current = index;
            audio.src = this.playlist[index].url;
            audio.dataset.hash = this.playlist[index].hash[0];
            this.$store.commit('setPlay', this.playlist[index].hash[0]);
            this.track = this.playlist[index];
            this.play();            
            let tracks = document.getElementsByClassName('card-track');
            for (let i = 0; i < tracks.length; i++) {
                if (this.playlist[this.current].hash[0] == tracks[i].id) {
                    tracks[i].classList.add('active');
                } else if (tracks[i].classList.contains('active')) {
                    tracks[i].classList.remove('active');
                }
            }
        },        
        loadTrack(){
            const audio = document.getElementById('audio');  
            this.playlist[this.current].class = 'tr-active';
            this.track = this.playlist[this.current];
            audio.src = this.playlist[this.current].url;
            audio.dataset.hash = this.playlist[this.current].hash[0];
            let tracks = document.getElementsByClassName('card-track');
            for (let i = 0; i < tracks.length; i++) {
                if (this.playlist[this.current].hash[0] == tracks[i].id) {
                    tracks[i].classList.add('active');
                } else if (tracks[i].classList.contains('active')) {
                    tracks[i].classList.remove('active');
                }
            }
            const vm = this;
            audio.onended = function() {      
                vm.playlist[vm.current].class = null;
                vm.current++;
                if (vm.current >= vm.playlist.length) { 
                    vm.current = 0; 
                    vm.track = vm.playlist[vm.current];
                    audio.src = vm.playlist[vm.current].url; 
                    audio.dataset.hash = vm.playlist[vm.current].hash[0];
                    vm.$store.commit('setPlay', vm.playlist[vm.current].hash[0]);
                    document.getElementById('play-control').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
                }
                else { 
                    audio.src = vm.playlist[vm.current].url; 
                    audio.dataset.hash = vm.playlist[vm.current].hash[0];
                    vm.$store.commit('setPlay', vm.playlist[vm.current].hash[0]);
                    audio.play(); 
                    document.getElementById('play-control').innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>'
                }
                vm.track = vm.playlist[vm.current];         
                vm.playlist[vm.current].class = 'tr-active';                               
                let tracks = document.getElementsByClassName('card-track');
                for (let i = 0; i < tracks.length; i++) {
                    if (vm.playlist[vm.current].hash[0] == tracks[i].id) {
                        tracks[i].classList.add('active');
                    }
                    if (vm.playlist[vm.current - 1].hash[0] == tracks[i].id) {
                        tracks[i].classList.remove('active');
                    }
                }
            } 
            console.log(this.playlist)
        },
        timeFunctions() {
            const audio = document.getElementById('audio');
            audio.addEventListener('durationchange', function() {
                let fullTime;
                if (Math.floor(audio.duration/60) < 10) fullTime = '0'+Math.floor(audio.duration/60) + ':';
                else fullTime = Math.floor(audio.duration/60) + ':';
                if (Math.floor(audio.duration - 60*Math.floor(audio.duration/60)) < 10) fullTime = fullTime + '0' + Math.floor(audio.duration - 60*Math.floor(audio.duration/60));
                else fullTime = fullTime +  Math.floor(audio.duration - 60*Math.floor(audio.duration/60));
                document.getElementById('time-full').innerHTML = fullTime;
            });

            audio.addEventListener('progress', function() {
                const timeLine = document.getElementById('timeLineReady');
                timeLine.style.width = (audio.buffered.length*100) + '%';
            });

            setInterval(() => {
                let currentTime;
                if (Math.floor(audio.currentTime/60) < 10) currentTime = '0'+Math.floor(audio.currentTime/60) + ':';
                else currentTime = Math.floor(audio.currentTime/60) + ':';
                if (Math.floor(audio.currentTime - 60*Math.floor(audio.currentTime/60)) < 10) currentTime = currentTime + '0' + Math.floor(audio.currentTime - 60*Math.floor(audio.currentTime/60));
                else currentTime = currentTime +  Math.floor(audio.currentTime - 60*Math.floor(audio.currentTime/60));
                document.getElementById('time-play').innerHTML =  currentTime;
                const timeLine = document.getElementById('timeLinePlay');
                timeLine.style.width = (audio.currentTime*100/audio.duration) + '%';
                if (this.$store.getters.hash != this.playlist.hash) {
                    this.playlist = this.$store.getters.playlist;
                    this.current = this.$store.getters.current;
                    this.tempPlalist = this.$store.getters.playlist;
                    this.loadTrack();
                } else {
                    if (this.$store.getters.play != audio.dataset.hash) {
                        if (document.getElementById('shuffle').classList.contains('active')) 
                            this.shuffle();
                        this.play_track(this.$store.getters.current);
                    }
                }
            }, 100)
        },
        open_playlist() {    
            const playlist = document.getElementsByClassName('player-line')[0];
            if (playlist.style.bottom != '0px') {
                playlist.style.bottom = '0px';
                document.getElementById('more').innerHTML = '<i class="fa fa-angle-down" aria-hidden="true"></i>';
            } else {
                playlist.style.bottom = '-50vh';
                document.getElementById('more').innerHTML = '<i class="fa fa-angle-up" aria-hidden="true"></i>';
            }
        },
        loop() {
            const audio = document.getElementById('audio');
            if (audio.loop) {
                audio.loop = false;
                document.getElementById('loop').classList.remove("active");
            } else {
                audio.loop = true;
                document.getElementById('loop').classList.add("active");
            }           
        },
        mute() {
            const volumeSlider = document.getElementById('volume-slider');
            const audio = document.getElementById('audio'); 
            if (volumeSlider.value > 0) {
                volumeSlider.value = 0;
                audio.muted = true;
                document.getElementById('volume-icon').innerHTML = '<i class="fa fa-volume-off" aria-hidden="true"></i>';
            } else {
                audio.muted = false;
                volumeSlider.value = audio.volume*100;
                document.getElementById('volume-icon').innerHTML = '<i class="fa fa-volume-up" aria-hidden="true"></i>';
            }
        },
        shuffle() {
            if (document.getElementById('shuffle').classList.contains('active')) {
                let teemp = JSON.parse(localStorage.getItem('playlist'));
                this.playlist[this.current].class = null; 
                this.playlist = teemp;
                localStorage.removeItem('playlist');
                document.getElementById('shuffle').classList.remove("active");
                this.current = 0;
                for (let i = 1; i <= this.playlist.length; i++) this.playlist[i-1].index = i;
                this.playlist[0].class = 'tr-active';
                this.loadTrack();
                this.play();
            } else { 
                this.playlist[this.current].class = null;  
                localStorage.setItem('playlist', JSON.stringify(this.playlist));
                let temp = this.playlist;
                for (let i = temp.length - 1; i > 0; i--) {
                    let j = Math.floor(Math.random() * (i + 1));
                    [temp[i], temp[j]] = [temp[j], temp[i]];
                }
                this.playlist = null;
                this.playlist = temp;
                this.current = 0;
                for (let i = 1; i <= this.playlist.length; i++) this.playlist[i-1].index = i;
                this.playlist[0].class = 'tr-active';
                this.loadTrack();
                this.play();
                document.getElementById('shuffle').classList.add("active");
            }
        },
        nextTrack() {
            const audio = document.getElementById('audio'); 
            this.playlist[this.current].class = null;
            this.current++;
            if (this.current >= this.playlist.length) { 
                this.current = 0; 
                this.track = this.playlist[this.current];
                audio.src = this.playlist[this.current].url; 
                document.getElementById('play-control').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
            }
            else { 
                audio.src = this.playlist[this.current].url; 
                this.play(); 
            }
            this.track = this.playlist[this.current];         
            this.playlist[this.current].class = 'tr-active';            
            let tracks = document.getElementsByClassName('card-track');
            for (let i = 0; i < tracks.length; i++) {
                if (this.playlist[this.current].hash[0] == tracks[i].id) {
                    tracks[i].classList.add('active');
                } else if (tracks[i].classList.contains('active')) {
                    tracks[i].classList.remove('active');
                }
            }
            this.$store.commit('setPlay', this.playlist[this.current].hash[0]);
        }, 
        prevTrack() {
            const audio = document.getElementById('audio'); 
            if (audio.currentTime > 5) { audio.currentTime = 0; return; }
            this.playlist[this.current].class = null;
            if (this.current == 0) this.current = this.playlist.length;
            this.current--;
            audio.src = this.playlist[this.current].url; 
            this.play(); 
            this.track = this.playlist[this.current];         
            this.playlist[this.current].class = 'tr-active';          
            let tracks = document.getElementsByClassName('card-track');
            for (let i = 0; i < tracks.length; i++) {
                if (this.playlist[this.current].hash[0] == tracks[i].id) {
                    tracks[i].classList.add('active');
                } else if (tracks[i].classList.contains('active')) {
                    tracks[i].classList.remove('active');
                }
            }
            this.$store.commit('setPlay', this.playlist[this.current].hash[0]);
        },
        onChangeSlider() {                               
            const volumeSlider = document.getElementById('volume-slider');
            const audio = document.getElementById('audio'); 
            audio.volume = volumeSlider.value/100;
            volumeSlider.addEventListener('input', () => {
                audio.volume = volumeSlider.value/100;
                if (volumeSlider.value == 0) {
                    document.getElementById('volume-icon').innerHTML = '<i class="fa fa-volume-off" aria-hidden="true"></i>';
                } else if (volumeSlider.value < 50) {
                    document.getElementById('volume-icon').innerHTML = '<i class="fa fa-volume-down" aria-hidden="true"></i>';
                } else if (volumeSlider.value >= 50) {
                    document.getElementById('volume-icon').innerHTML = '<i class="fa fa-volume-up" aria-hidden="true"></i>';
                }
            })
        },
        favorite() {            
            if (document.getElementById('favorite').classList.contains('active')) {
                document.getElementById('favorite').classList.remove("active");
            } else {
                document.getElementById('favorite').classList.add("active");
            }
        }
    }, 
    watch: {
        track: {
            handler: function () {
                this.timeFunctions();
            },            
        }
    }
}
</script>

<style lang="scss" scoped>
$screen-l: 1240px;
$screen-m: 960px;
$screen-s: 520px;
$screen-xs: 300px;
$screens: (all, 1250, 970, 540); 
@mixin media($property, $values){
    /*разбиваем введенные значения в цикле*/
    @for $i from 1 through length($values) { 
        /*Проверяем, если значение прописано как '' тогда пропускаем его*/
        @if nth($values, $i) != ''{ 
            @if nth($screens, $i) == 'all'{ 
                /*Если это первое значение, тогда значение пропишется без @media screen */
                #{$property}: unquote(#{nth($values, $i)});
            } @else {
                /*иначе помещаем свойство в @media screen с соответствующим индексом*/
                @media screen and (max-width: nth($screens, $i) + 'px') {
                    #{$property}: unquote(#{nth($values, $i)});
                }
            }
        }
    }
}

.time-line {
    width: 100%;
    cursor: pointer;
}

.time-full {    
    height: 10px;
    width: 100%;
    background: rgba(70, 70, 70, 0.726);
}

.time-ready {
    position: absolute;
    margin-top: -10px;
    height: 10px;
    width: 0%;
    background: rgb(114, 31, 31);
    transition: all 2s linear;
}

.time-play {
    position: absolute;
    margin-top: -10px;
    height: 10px;
    width: 0%;
    background: rgb(255, 58, 58);
}

.time-play-point {
    display: block;
    background: rgb(255, 58, 58);
    height: 10px;
    width: 10px;
    position: absolute;
    right: 0;
    margin: -5px -10px 0 0;
    border: 5px solid rgb(187, 42, 42);
    border-radius: 50%;
}

.player {
    display: grid;
    @include media(grid-template-columns, (repeat(8, 1fr), repeat(8, 1fr), repeat(8, 1fr), repeat(8, 1fr)));
    @include media(grid-template-rows, (repeat(1, 1fr), repeat(1, 1fr), repeat(1, 1fr), repeat(2, 1fr)));
    @include media(width, ($screen-l, $screen-m, 100%, 100%));
    margin: 0 auto;
    @include media(height, (60px, 60px, 60px, 120px));    
}

.controls {
    @include media(grid-column, ('span 2', 'span 2', 'span 2', 'span 8'));
    @include media(grid-rows, ('span 2', 'span 2', 'span 2', 'span 1'));
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    width: 100%;
}

.more-controls {
    grid-column: span 2;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    width: 100%;
}

.track {
    @include media(grid-column, ('span 4', 'span 4', 'span 4', 'span 6'));
    @include media(grid-rows, ('span 2', 'span 2', 'span 2', 'span 1'));
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(10, 1fr);
    width: 100%;
    padding: 10px;
}

.track-cover {
    grid-row: span 2;
    grid-column: span 1;
    border-radius: 50%;

    & img {
        border-radius: 50%;
    }
}

.cover-play {
    opacity: 0;
    height: 40px;
    width: 42px;
    position: absolute;
    margin-left: -41px;
    background-color: rgba(0, 0, 0, 0.568);
    border: none;
    border-radius: 50%;
    outline: none;
    font-size: 1.5rem;
    padding-left: 10px;
    color: white;
    cursor: pointer;
    transition: all 200ms ease-in-out;
}

.track-title {
    grid-row: span 1;
    grid-column: span 7;
    font-weight: bold;
    color: white;
    margin-left: 5px;
    overflow: hidden;
    white-space: nowrap; 
    text-overflow: ellipsis;
}

.track-artists {
    grid-row: span 1;
    grid-column: span 7;
    color: rgb(204, 204, 204);
    margin-left: 5px;
    overflow: hidden;
    white-space: nowrap; 
    text-overflow: ellipsis;
}

.track-time {    
    grid-row: span 2;
    grid-column: span 2;
    color: rgb(204, 204, 204);
    margin: auto;
}

.hide {
    display: none !important;
}

#volume-slider {
    grid-column: span 2;
    -webkit-appearance: none;  /* Override default CSS styles */
    appearance: none;
    height: 5px;
    width: 100%;
    outline: none;
    margin: auto;
    background: #71969b;

    &::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        border-radius: 20%;
        width: 7px; /* Set a specific slider handle width */
        height: 15px; /* Slider handle height */
        background: #0ba5b9; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

    &::-moz-range-thumb {
        border-radius: 20%;
        width: 7px; /* Set a specific slider handle width */
        height: 15px; /* Slider handle height */
        background: #0ba5b9; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }
}

#volume-icon {
    cursor: pointer;
}

.control {
    grid-column: span 1;
    background-color: transparent;
    border: none;
    border-radius: 0;
    height: 100%;
    outline: none;
    font-size: 1.3rem;
    color: rgb(122, 151, 151);
    cursor: pointer;

    &:hover {    
        font-size: 1.4rem;
        color: rgb(0, 225, 255);
        transition: color 100ms ease-in-out;
    }
}

.playlist {
    display: list-item;
    height: 50vh;
    overflow-y: auto;
}

.playlist-header {
    display: grid;
    height: 35px;
    background-color: rgb(31, 30, 32);

    .playlist-name {
        margin: auto 0;
        margin-left: 25px;
        margin-right: 25px;
        color: white;
        overflow: hidden;
        white-space: nowrap; 
        text-overflow: ellipsis;
    }
}


.playlist-track {
    display: grid;
    grid-row: span 1;
    max-height: 60px;
    @include media(grid-template-columns, (repeat(8, 1fr), repeat(8, 1fr), repeat(5, 1fr), repeat(3, 1fr)));    
    cursor: pointer;
    transition: all 150ms ease-in-out;

    &:hover {
        background-color: rgb(255, 58, 58) !important;

        .cover-play {
            opacity: 1;
        }
    }  

    &:nth-child(odd) {
        background-color: rgba(49, 124, 131, 0.082);
    }
}

.tr-active {
    background-color: rgba(255, 58, 58, 0.691) !important;
}

.track-header {
    grid-column: span 5;
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(10, 1fr);
    padding: 10px;
}

.track-number {    
    grid-column: span 1;
    grid-row: span 2;
    color: lightgray;
    margin: auto;
}


</style>

<style scoped>
.player-line {
    position: fixed;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.513);
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0));
    width: 100%;
    bottom: -50vh;
    transition: all 500ms ease-in-out;
    z-index: 1000;
}

.b-main {
    font-size: 1.7rem;
}

.more {    
    font-size: 1.7rem;
}

.b-main:hover {
    font-size: 1.8rem;
}

.more:hover {    
    font-size: 1.9rem;
}

.active {
    color: #ff4242;
}

.active:hover {
    color: #ff2f2f;
}

.fav:hover {
    color: rgb(255, 82, 82);
}

.fav-active {
    color: rgb(255, 46, 46);
}

</style>