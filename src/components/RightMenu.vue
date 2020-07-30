<template>
  <div class="rightMenu">
    <div class="menu-header"><b class="haeder-text">Основное</b></div>
    <div class="menu-element"><span class="link-text">Новинки</span></div>
    <div class="menu-element"><span class="link-text">Топ 100</span></div>
    <div class="menu-element"><span class="link-text">Артисты</span></div>
    <div class="menu-element"><span class="link-text">Альбомы</span></div>
    <div class="menu-element"><span class="link-text">Плейлисты</span></div>
  </div>
</template>

<script>
export default {
  name: 'RightMenu',
  props: {
    msg: String
  }
}
</script>

<style lang="scss" scoped>
.rightMenu {
    grid-column: span 1;
}

.menu-header {
    color: white;
    font-size: 1.5rem;
    height: 50px;
}

.haeder-text {
    padding: 10px;
    border-bottom: 1px solid #ff4242;
}

.menu-element {
    height: 25px;
    padding: 5px;
}

.link-text {    
    color: lightgray;
    min-width: 10px;
    cursor: pointer;
    padding: 5px;
    border-left: 3px solid #ff4242;
    transition: all 300ms ease-in-out;

    &:hover {
        color: white;
        text-decoration: underline;
        background-color: rgba(0, 0, 0, 0.123);
        padding-right: 30px;
        border-left: 25px solid #ff4242;
    }
}


</style>

<style scoped>

</style>
