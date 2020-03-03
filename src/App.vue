<template lang='pug'>
  el-container#app
    el-header
      TopBar
    el-main
      router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TopBar from '@/components/TopBar.vue';

@Component({components: {TopBar}})
export default class App extends Vue {}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
