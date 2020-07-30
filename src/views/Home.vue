<template>
  <div class="home">
    <Content />
    <RightMenu />
  </div>
</template>

<script>
import Content from '@/components/Content.vue'
import RightMenu from '@/components/RightMenu.vue'

export default {
  name: 'Home',
  components: {
    Content, 
    RightMenu,
  }
}
</script>

<style lang="scss" scoped>
.home {
  color: white;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
</style>