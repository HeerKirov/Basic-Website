<template lang='pug'>
    el-container#app
        el-header
            TopBar
        el-main
            el-row
                el-col(:xs='spanOfContent.xs', :sm='spanOfContent.sm', :md='spanOfContent.md', :lg='spanOfContent.lg', :xl='spanOfContent.xl')
                    router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TopBar from '@/components/TopBar.vue';
import config from '@/config';

@Component({components: {TopBar}})
export default class extends Vue {
    //常量数据
    private readonly spanOfContent = {
        xs: 24,
        sm: {span: 22, offset: 1},
        md: {span: 20, offset: 2},
        lg: {span: 18, offset: 3},
        xl: {span: 16, offset: 4}
    };
    //compute方法
}
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
