<template lang="pug">
    div
        el-row
            div.float-right
                el-button(type='success', size='mini', icon='el-icon-plus', @click='onCreate') 新建
        el-row.m-4
            el-table(:data='data')
                el-table-column(width='55')
                    template(slot-scope='scope')
                        el-link(@click='onDetail(scope.row.username)', :underline='false')
                            el-image(:src='getCoverURL(scope.row.cover)')
                el-table-column(label='用户名')
                    template(slot-scope='scope')
                        el-link(@click='onDetail(scope.row.username)') {{scope.row.username}}
                el-table-column(label='昵称')
                    template(slot-scope='scope')
                        el-link(@click='onDetail(scope.row.username)') {{scope.row.name}}
                el-table-column(label='管理员', width='75')
                    template(slot-scope='scope')
                        i.el-icon-check(v-if='scope.row.isStaff')
                el-table-column(label='可用', width='75')
                    template(slot-scope='scope')
                        i.el-icon-check(v-if='scope.row.enable')
                el-table-column(label='注册途径', width='110')
                    template(slot-scope='scope')
                        template(v-if='scope.row.createPath == "System"')
                            i.mr-1.el-icon-switch-button
                            = '系统'
                        template(v-if='scope.row.createPath == "Admin"')
                            i.mr-1.el-icon-user-solid
                            = '管理员'
                        template(v-if='scope.row.createPath == "Code"')
                            i.mr-1.el-icon-key
                            = '注册码'
                        template(v-if='scope.row.createPath == "Public"')
                            i.mr-1.el-icon-sunny
                            = '开放注册'
                el-table-column(label='注册时间')
                    template(slot-scope='scope') {{toDateTimeString(scope.row.createTime)}}
        UserDetailDialog(ref='detailDialog', @change='onModifySuccess')
        UserCreateDialog(ref='createDialog', @success='onCreateSuccess')
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Dict, Format} from '@/common/util';
import core from '@/sdk/core';
import userInfo from '@/sdk/modules/user-info';
import adminUser, { UserInfoRes } from '@/sdk/modules/admin-user';
import UserDetailDialog from '@/components/UserDetailDialog.vue';
import UserCreateDialog from '@/components/UserCreateDialog.vue';

@Component({components: {UserDetailDialog, UserCreateDialog}})
export default class extends Vue {
    //常量数据
    private readonly EMPTY_AVATAR = require('@/assets/empty_avatar.jpg');
    //变量
    private data: UserInfoRes[] = [];

    //vue事件
    private mounted() {
        this.requestForList();
    }
    //UI事件
    private onCreate() {
        (this.$refs['createDialog'] as UserCreateDialog).open();
    }
    private onDetail(username: string) {
        (this.$refs['detailDialog'] as UserDetailDialog).open(username);
    }
    private onModifySuccess(e: {mode: "update"|"delete", username: string}) {
        this.requestForList();
    }
    private onCreateSuccess(e: {username: string}) {
        this.requestForList();
    }
    //业务逻辑
    private async requestForList() {
        let res = await adminUser.getUserList();
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
    private getCoverURL(cover: string) {
        return cover != null ? userInfo.getCoverURL(cover) : this.EMPTY_AVATAR;
    }
    private toDateTimeString(d?: Date): string {
        return Format.toDateTimeString(d);
    }
}
</script>

<style scoped>
    @import '../style/layout.css';
</style>