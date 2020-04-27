<template lang="pug">
    div
        el-row
            div.float-right
                el-button(type='success', size='mini', icon='el-icon-plus', @click='onCreate') 新建
        el-row.m-4
            el-col(v-for='(item, index) in data', :key='item.appId', :xs='spanOfCard.xs', :sm='spanOfCard.sm', :md='spanOfCard.md', :lg='spanOfCard.lg', :xl='spanOfCard.xl')
                AppCard(:app-id='item.appId', :title='item.name', :un-public='!item.public', :description='item.description',
                        @title-click='onClickApp')
        AppDialog(ref='dialog', @change='onModifySuccess')
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import AppCard from '@/components/AppCard.vue';
import AppDialog from '@/components/AppDialog.vue';
import core from '@/sdk/core';
import adminApp, {AppInfoRes, AppCreateReq, AppUpdateReq, AppSecretRes} from '@/sdk/modules/admin-app';

@Component({components: {AppCard, AppDialog}})
export default class extends Vue {
    //常量数据
    private readonly spanOfCard = {xs: 24, sm: 12, md: 8, lg: 8, xl: 6};
    //变量数据
    private data: AppInfoRes[] = [];

    //vue事件
    private mounted() {
        this.requestForList();
    }
    //UI事件
    private onCreate() {
        (this.$refs.dialog as AppDialog).open();
    }
    private onClickApp(e: {appId: string}) {
        (this.$refs.dialog as AppDialog).open(e.appId);
    }
    private onModifySuccess(e: {mode: "new"|"edit"|"delete", appId: string}) {
        this.requestForList();
    }
    //业务逻辑
    private async requestForList() {
        let res = await adminApp.getAppList();
        if(res.ok) {
            this.data = res.data;
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
        }
    }
}
</script>

<style scoped>
    @import '../style/layout.css';
</style>