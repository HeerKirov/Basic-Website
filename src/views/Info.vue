<template lang='pug'>
    div
        el-row(v-if='logined')
            el-col.content(:xs='spanOfContent.xs', :sm='spanOfContent.sm', :md='spanOfContent.md', :lg='spanOfContent.lg')
                el-upload(action='', :before-upload='onSubmitAvatar', :limit='1')
                    img.avatar(:src='userCoverURL')
                h2.mt-2.mb-0(v-if='!editNameMode') {{data.name}}
                    el-link.edit-name-button(@click='onEditName')
                        i.el-icon-edit
                el-input(v-else, v-model='data.name')
                    el-button(slot='append', icon='el-icon-check', @click='onSubmitName')
                div.f-15
                    span @{{data.username}}
                el-link.mt-3(href='/admin', v-if='data.isStaff')
                    i.el-icon-s-custom
                    = '系统管理员'
                div.f-13.mt-4
                    span.mr-1 注册时间
                    span {{toDateTimeString(data.createTime)}}
                div.float-right.mt-4
                    el-link(@click='onLogout')
                        i.el-icon-s-unfold
                        = '退出登录'
        CaseNumber
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import CaseNumber from '@/components/CaseNumber.vue';
import {Dict, Format} from '@/common/util';
import core, {TOKEN_CREATE_REV} from '@/sdk/core';
import userInfo, {UserInfoRes} from '@/sdk/modules/user-info';

@Component({components: {CaseNumber}})
export default class extends Vue {
    //常量数据
    private readonly EMPTY_AVATAR = require('@/assets/empty_avatar.jpg');
    private readonly spanOfContent = {
        xs: 24,
        xm: {span: 16, offset: 4},
        md: {span: 14, offset: 5},
        lg: {span: 12, offset: 6}
    };
    //变量数据
    private data: any = {};
    private editNameMode: boolean = false;
    //compute方法
    private get userCoverURL() {
        return this.data.cover ? userInfo.getCoverURL(this.data.cover) : this.EMPTY_AVATAR;
    }
    //vue事件
    private get logined(): boolean|null {
        let logined = this.$store.state.user.isLogin;
        if(logined === true) {
            this.requestForInfo();
        }else if(logined === false) {
            this.$router.push({name: 'login'});
        }
        return logined;
    }
    //UI事件
    private onLogout() {
        core.logout();
        this.$router.push({name: 'home'})
    }
    private onEditName() {
        this.editNameMode = true;
    }
    private async onSubmitName() {
        if(this.data.name == null || this.data.name.trim() == '') {
            this.$notify.warning({
                title: '警告',
                message: '不能使用空的名字',
                duration: 10
            });
            return;
        }
        let name = this.data.name.trim();
        let res = await userInfo.updateUserInfo({name});
        if(res.ok) {
            this.editNameMode = false;
            this.$store.commit('updateUserInfo', {name});
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
        }
    }
    private async onSubmitAvatar(file: File): Promise<boolean> {
        let res = await userInfo.uploadUserCover(file);
        if(res.ok) {
            let res = await userInfo.getUserInfo();
            if(res.ok) {
                this.$store.commit('updateUserInfo', {cover: res.data.cover});
                this.data.cover = res.data.cover;
            }else{
                this.$notify.error({
                    title: '错误',
                    message: res.data,
                    duration: 0
                });
            }
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
        }
        return new Promise((resolve, reject) => reject());
    }
    //业务函数
    private async requestForInfo() {
        let res = await userInfo.getUserInfo();
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
    //工具函数
    private toDateTimeString(d?: Date): string {
        return Format.toDateTimeString(d);
    }
}
</script>

<style scoped>
    @import '../style/layout.css';

    .content {
        margin-top: 20px;
        text-align: center;
    }
    .avatar {
        height: 120px;
        width: 120px;
        border-radius: 5px;
    }
    .edit-name-button {
        font-size: 16px;
        position: absolute;
        transform: translate(8px, 6px);
    }
</style>