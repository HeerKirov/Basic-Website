<template lang='pug'>
  div.admin
    el-tabs.mt-4(tab-position='left')
      el-tab-pane
        span(slot='label')
          i.el-icon-receiving
          = '应用程序管理'
        AdminTabApp
      el-tab-pane
        span(slot='label')
          i.el-icon-user
          = '用户管理'
        AdminTabUser
      el-tab-pane
        span(slot='label')
          i.el-icon-key
          = '激活码管理'
        AdminTabCode
      el-tab-pane
        span(slot='label')
          i.el-icon-setting
          = '系统设置'
        AdminTabSetting
    CaseNumber
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import CaseNumber from '@/components/CaseNumber.vue';
import AdminTabApp from '@/components/AdminTabApp.vue';
import AdminTabUser from '@/components/AdminTabUser.vue';
import AdminTabCode from '@/components/AdminTabCode.vue';
import AdminTabSetting from '@/components/AdminTabSetting.vue';
import core from '@/sdk/core';

@Component({components: {CaseNumber, AdminTabApp, AdminTabUser, AdminTabCode, AdminTabSetting}})
export default class extends Vue {

}
</script>

<style scoped>
    @import '../style/layout.css';

</style>
