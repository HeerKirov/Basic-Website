<template lang='pug'>
  div.home
    el-row.tab-title-row(v-if='logined')
        el-button-group.tab-title
            el-button(size='mini', :type='listType == "my" ? "primary" : undefined', plain, @click='onTabClick("my")', icon='el-icon-collection') 我的应用
            el-button(size='mini', :type='listType == "all" ? "primary" : undefined', plain, @click='onTabClick("all")', icon='el-icon-receiving') 全部应用
    el-row
        el-col(v-for='(item, index) in data', :key='item.app.appId', :xs='spanOfCard.xs', :sm='spanOfCard.sm', :md='spanOfCard.md', :lg='spanOfCard.lg', :xl='spanOfCard.xl')
            AppCard(:title='item.app.name', :url='item.app.url', :un-public='!item.publicApp', :description='item.app.description')
    CaseNumber
</template>

<script lang='ts'>
import {Component, Vue} from 'vue-property-decorator';
import CaseNumber from '@/components/CaseNumber.vue';
import AppCard from '@/components/AppCard.vue';
import core from '@/sdk/core';
import userApp, {AppInfoRes, UseInfoRes} from '@/sdk/modules/user-app';

interface Data {
    publicApp?: boolean
    lastUse?: Date
    createTime?: Date
    app: AppInfoRes
}

const AdminApp: Data = {
    app: {
        appId: 'admin',
        name: '管理员控制台',
        description: '基础服务的管理控制台。',
        url: {
            'index': '#/admin'
        },
        createTime: new Date('1970-01-01T00:00:00.000Z'),
        updateTime: new Date('1970-01-01T00:00:00.000Z')
    },
    publicApp: false
};

@Component({components: {CaseNumber, AppCard}})
export default class extends Vue {
    //常量数据
    private readonly spanOfCard = {xs: 24, sm: 12, md: 8, lg: 8, xl: 6};
    //变量数据
    private isLogin: boolean|null = null;
    private listType: "my"|"all" = "all";
    private data: Data[] = [];
    //vue事件
    private get logined(): boolean|null {
        if(this.isLogin == null) {
            let logined = this.$store.state.user.isLogin;
            let staff = this.$store.state.user.isStaff;
            if(staff != null) {
                console.log('staff is not null')
                console.log('logined is ' + logined)
                if(logined === true) {
                    this.listType = "my";
                    this.requestForList();
                    this.isLogin = true;
                }else if(logined === false) {
                    this.listType = "all";
                    this.requestForList();
                    this.isLogin = false;
                }
            }
        }
        return this.isLogin;
    }
    //UI事件
    private onTabClick(type: "my"|"all") {
        if(type != this.listType) {
            this.listType = type;
            this.requestForList();
        }
    }
    //业务逻辑
    private async requestForList() {
        if(this.listType === "my") {
            let res = await userApp.getUsingAppList();
            if(res.ok) {
                if(this.$store.state.user.isStaff) {
                    this.data = (res.data as Data[]).concat([AdminApp]);
                }else{
                    this.data = res.data as Data[];
                }
            }else{
                this.$notify.error({
                    title: '错误',
                    message: res.data,
                    duration: 0
                });
            }
        }else{
            let res = await userApp.getAppList();
            if(res.ok) {
                this.data = res.data.map(appInfo => {return{app: appInfo, publicApp: true}});
            }else{
                this.$notify.error({
                    title: '错误',
                    message: res.data,
                    duration: 0
                });
            }
        }
    }
}
</script>

<style scoped>
    @import '../style/layout.css';
    .tab-title-row {
        margin-top: 20px;
        margin-bottom: 50px;
    }
    .tab-title {
        position: absolute;
        left: 50%;
        width: 194px;
        transform: translateX(-50%);
    }
</style>
