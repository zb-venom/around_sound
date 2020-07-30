<template>
  <div id="app">
    <div class="nav-line">
      <div class="nav">
        <div class="el-1 logo"><div class="center"><img src="/favicon.ico" width="25px" height="25px" alt=""></div></div>
        <router-link class="el-1 hov s-el" to="/"><div class="center">Главная</div></router-link>
        <!-- <router-link class="el-1 hov xs-el" to="/new"><div class="center">Новинки</div></router-link>
        <router-link class="el-1 hov xs-el" to="/top"><div class="center">Топ 100</div></router-link> -->
        <div class="el-3 search-box s-el"><input type="search" class="search" placeholder="Поиск"></div>
        <router-link class="el-1 hov xs-el" to="/apps/bpm_analizer"><div class="center">BPM Analizer</div></router-link>
        <router-link class="el-1 hov xs-el" to="/upload"><div class="center">Загрузить</div></router-link>
        <div class="el-2 hov-line s-el"><div class="center"><b>Личный кабинет</b></div></div>
      </div>
    </div>
    <Player />
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Player from '@/components/Player.vue'

export default {  
  components: {
    Player
  }
}

</script>

<style lang="scss">
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

.nav {
  display: grid;
  @include media(grid-template-columns, (repeat(9, 1fr), repeat(9, 1fr), repeat(7, 1fr), 1fr));
  color: white;
  height: 50px;
  @include media(width, ($screen-l, $screen-m, $screen-s, $screen-xs));
  margin: 0 auto;
}

.el-1 {
  grid-column: span 1;
  justify-self: center;
  align-self: center;
  display: block;
  height: 100%;
  @include media(width, ($screen-l/11, $screen-m/11, $screen-s/7, 250px));
  cursor: pointer;
}

.el-2 {
  grid-column: span 2;
  justify-self: center;
  align-self: center;
  display: block;
  height: 100%;
  @include media(width, ($screen-l/11*2, $screen-m/11*2, $screen-s/7*2, 0));
  cursor: pointer;
}

.el-3 {
  grid-column: span 3;
  justify-self: center;
  align-self: center;
}

.search {
  @include media(width, ($screen-l/11*3 - 10px, $screen-m/11*3 - 10px, $screen-s/7*3 - 10px, 0));
  border: 1px solid black;
  border-radius: 5px;
  padding-left: 7px;
  padding-right: 7px;
  height: 30px;
  background-color: lightgray;
  outline: none;
}

.search:focus {
  background-color: white;
}

.search::placeholder {
  color: rgb(95, 95, 95);
}

.xs-el {
  @include media(display, ('block', 'block', 'none', 'none'));
}

.s-el {
  @include media(display, ('block', 'block', 'block', 'none'));
}

.hov-line:hover {
  b {
    color: white;
    border-bottom: 4px solid #ff4242;
  }
}


.container {
  @include media(width, ($screen-l - 50px, $screen-m - 50px, calc(100vw - 50px), calc(100vw - 50px)));
  background-color: transparent;
  padding: 75px 25px;
  margin: 0 auto;
}

</style>

<style>
.container {
  min-height: calc(100vh - 150px);
}

#app {
  margin: 0;
  padding: 0;
}

.nav-line {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: rgb(31, 30, 32);
}

.hov {
  transition: all .2s ease-in-out;
}

.hov:hover {
  color: white;
  background-color: #d82020;
}

.router-link-exact-active {
  color: white;
  background-color: rgb(29, 26, 26);
}

.logo { 
  background-color: #ff4242;
}

.center {  
  position: relative;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
