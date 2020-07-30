<template>
  <div class="content">
    <div class="card" id="newTracks">
      <router-link class="card-header" to="/new">Новинки</router-link>
      <div class="card-body">
        <div class="card-track"
            v-for="newTrack in newTracks" 
            v-bind:key="newTrack.id" 
            v-on:click="play_track(newTrack.hash, newTrack.index)" 
            v-bind:class="newTrack.class" v-bind:id="newTrack.hash[0]">
            <div class="track-header">
                <label class="track-number">#{{ newTrack.index }}</label>
                <div class="track-cover center">
                    <img class="cover" src="https://i.pinimg.com/originals/2c/4a/f3/2c4af3bdd98bd63311ba0390ff9828fd.png" width="40px" height="40px">
                    <button class="cover-play"><i class="fa fa-play" aria-hidden="true"></i></button>
                </div>
                <span class="track-title">{{ newTrack.title }}</span>
                <span class="track-artists">{{ newTrack.artist }}<span v-if="newTrack.featurings">{{newTrack.featurings}}</span></span>
            </div>
        </div>
      </div>
      <router-link class="card-footer" to="/new">
          <span>&bull;&bull;&bull;</span>
      </router-link>
    </div>
    <div class="card" id="top100">
      <router-link class="card-header" to="/top100">Топ 100</router-link>
      <div class="card-body">
        <div class="card-track"
            v-for="top100 in top100" 
            v-bind:key="top100.id" 
            v-on:click="play_track(top100.hash, top100.index)" 
            v-bind:class="top100.class" v-bind:id="top100.hash[0]">
            <div class="track-header">
                <label class="track-number">#{{ top100.index }}</label>
                <div class="track-cover center">
                    <img calss="cover" src="https://i.pinimg.com/originals/2c/4a/f3/2c4af3bdd98bd63311ba0390ff9828fd.png" width="40px" height="40px">
                    <button class="cover-play"><i class="fa fa-play" aria-hidden="true"></i></button>
                </div>
                <span class="track-title">{{ top100.title }}</span>
                <span class="track-artists">{{ top100.artist }}<span v-if="top100.featurings">{{top100.featurings}}</span></span>
            </div>
        </div>
      </div>
      <router-link class="card-footer" to="/top100">
          <span>&bull;&bull;&bull;</span>
      </router-link>
    </div>
  </div>  
</template>

<script>
import {http} from '../scripts/http';
import md5 from 'js-md5';

export default {
  name: 'Content',
  props: {
    msg: String
  },
  data() {
        return {
            newTracks: [],
            top100: [],
            errors: [], 
            current: null
        }
    },
    created() {
      http.get('get/lasttracks/10')
      .then(response => {
          const newTracks = response.data; 
          this.newTracks = newTracks;
          this.newTracks.url = 'get/lasttracks/10';
          this.newTracks.name = 'newTracks';
          this.current = 0;
          let hash = md5(this.newTracks.name);
          this.newTracks.hash = hash;
          for (let i = 1; i <= this.newTracks.length; i++) { 
              this.newTracks[i-1].index = i; 
              this.newTracks[i-1].hash = [this.newTracks[i-1].hash, hash]; 
              if (this.newTracks[i-1].featuring.length > 0) {
                  this.newTracks[i-1].featurings = '';
                  for (let j = 0; j < this.newTracks[i-1].featuring.length; j++)
                      this.newTracks[i-1].featurings = this.newTracks[i-1].featurings + ', ' + this.newTracks[i-1].featuring[j];
              }
          }          
      })
      .catch(e => {
          this.errors.push(e)
      });
      http.get('get/playlist/top100')
      .then(response => {
          const top100 = response.data; 
          this.top100 = top100;
          this.top100.name = 'top100';
          this.current = 0;
          let hash = md5(this.top100.name);
          this.top100.hash = hash;
          for (let i = 1; i <= this.top100.length; i++) { 
              this.top100[i-1].index = i; 
              this.top100[i-1].hash = [this.top100[i-1].hash, hash]; 
              if (this.top100[i-1].featuring.length > 0) {
                  this.top100[i-1].featurings = '';
                  for (let j = 0; j < this.top100[i-1].featuring.length; j++)
                      this.top100[i-1].featurings = this.top100[i-1].featurings + ', ' + this.top100[i-1].featuring[j];
              }
          }          
      })
      .catch(e => {
          this.errors.push(e)
      });
  }, 
  methods: {
    play_track(hash, index) {
      if (hash[1] == this.$store.getters.playlist.hash) {
        if (hash[0] == this.$store.getters.play) {
          const audio = document.getElementById('audio'); 
            if (audio.paused) {
                audio.play();
                document.getElementById('play-control').innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
            } else {
                audio.pause();
                document.getElementById('play-control').innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
            }
        } else {
          this.$store.commit('setPlay',hash[0]);
          this.$store.commit('setHash', hash[1]);
          this.$store.commit('setCurrent', index);
        }
      }      
      else {
        if (hash[1] == md5(this.top100.name))
          this.$store.commit('setPlaylist', this.top100);
        else if (hash[1] == md5(this.newTracks.name))
          this.$store.commit('setPlaylist', this.newTracks);
        this.$store.commit('setPlay',hash[0]);
        this.$store.commit('setHash', hash[1]);
        this.$store.commit('setCurrent', index);
      }
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

.content {
  grid-column: span 3;
  padding-right: 20px;
}

.card {
  margin-bottom: 50px;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: .5rem;
}

.card-header {
  display: block;
  height: 40px;
  font-size: 1.5rem;
  background-color: rgb(36, 35, 35);
  padding: 10px;
  padding-bottom: 0;
  border-bottom: 1px solid #ff4242;
  border-radius: .5rem .5rem 0 0;

  &:hover {
    height: 36px;
    background-color: rgb(27, 25, 25);
    border-bottom: 5px solid #ff4242;
  }
}

.card-body {  
  background-color: rgba(0, 0, 0, 0.181);
  display: grid;
  height: 50vh;
  overflow: auto;
  grid-template-rows: repeat(10, 1fr);
}

.card-track {
  display: grid;
  grid-row: span 1;
  max-height: 60px;
  @include media(grid-template-columns, (repeat(8, 1fr), repeat(8, 1fr), repeat(5, 1fr), repeat(3, 1fr)));    
  cursor: pointer;
  transition: all 150ms ease-in-out;

  &:nth-child(odd) {
      background-color: rgba(49, 124, 131, 0.082);
  }

  &:hover {
    background-color: rgb(255, 58, 58) !important;

    .cover-play {
      opacity: 1;
    }
  }
}

.active {
  
  animation: active 7s ease-in-out infinite;

  .cover, .cover-play {
    animation: rotate 5s linear infinite;
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
    font-size: 1.1rem;
    padding-left: 10px;
    color: white;
    cursor: pointer;
    transition: all 200ms ease-in-out;
}

.card-active {
  animation: rotate 5s linear;
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

.card-footer {
  display: block;
  text-align: center;
  font-size: 2rem;
  color: white;
  cursor: pointer;
  border-bottom: 1px solid #ff4242;
  background-color: rgb(36, 35, 35);

  &:hover {
  background-color: rgb(22, 21, 21);
    color: #ff4242;
    border-bottom: 1px solid white;
  }
}


@keyframes rotate {
  0% {    
    transform: rotate(0deg);
  }
  100% {    
    transform: rotate(360deg);
  }
}

@keyframes active {
  0% {    
    background-color: rgb(255, 58, 58);
  }
  50% {    
    background-color: rgb(146, 39, 39);;
  }
  100% {    
    background-color: rgb(255, 58, 58);
  }
}

</style>

<style scoped>

</style>
