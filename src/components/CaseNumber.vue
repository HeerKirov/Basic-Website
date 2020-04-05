<template lang="pug">
    div.case-link(v-if='caseNumber != null')
        el-link(:href='caseURL || "#"', target='_blank') {{caseNumber}}
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import config from '@/config';

@Component
export default class TopBar extends Vue {
    //compute方法
    private get caseNumber() {
        return config.CASE_NUMBER;
    }
    private get caseURL() {
        return config.CASE_URL;
    }
}
</script>

<style scoped>
    .case-link {
        text-align: center;
        margin-top: 20px;
    }
</style>