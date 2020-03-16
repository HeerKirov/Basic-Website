<template lang='pug'>
    el-container#app
        el-header
            TopBar
        el-main
            el-row
                el-col(:xs='xs', :sm='sm', :md='md', :lg='lg', :xl='xl')
                    router-view
        el-footer
            div.case-link(v-if='caseNumber != null')
                el-link(:href='caseURL || "#"', target='_blank') {{caseNumber}}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TopBar from '@/components/TopBar.vue';
import config from '@/config';

@Component({components: {TopBar}})
export default class extends Vue {
    private readonly xs = 24;
    private readonly sm = {span: 22, offset: 1};
    private readonly md = {span: 20, offset: 2};
    private readonly lg = {span: 18, offset: 3};
    private readonly xl = {span: 16, offset: 4};

    private get caseNumber() {
        return config.CASE_NUMBER;
    }
    private get caseURL() {
        return config.CASE_URL;
    }
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
.case-link {
    text-align: center;
    margin-top: 20px;
}
</style>
