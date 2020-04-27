<template lang="pug">
    el-dialog(:visible.sync='visible', title='用户详情')
        el-row
            el-col(:xs='24', :span='6')
                el-image(:src='getCoverURL(data.cover)')
                div
                    el-button.button(size='small', plain, v-if='mode == "detail"', @click='onChangePassword') 修改密码
                    el-button.button(size='small', plain, v-else, @click='onChangePassword') 放弃修改
                    el-button.button(type='warning', size='small', plain, v-if='data.enable', @click='onDisable') 禁用用户
                    el-button.button(type='success', size='small', plain, v-else, @click='onEnable') 启用用户
                    el-button.button(type='danger', size='small', plain, @click='onDelete') 删除用户
            el-col(:xs='24', :span='18', v-if='mode == "detail"')
                el-row.mb-1
                    el-col.key-col(:span='4', :xs='24') 用户名
                    el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                        div.mt-2
                            i {{data.username}}
                el-row.mb-1
                    el-col.key-col(:span='4', :xs='24') 昵称
                    el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                        div.mt-2
                            b {{data.name}}
                el-row.mb-1
                    el-col.key-col(:span='4', :xs='24') 可用性
                    el-col.mt-1(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                        el-tag.mr-1(type='primary', effect='plain', size='small', :disable-transitions='true', v-if='data.enable') 可用
                        el-tag.mr-1(type='danger', effect='dark', size='small', :disable-transitions='true', v-else) 禁用
                        el-tag.mr-1(type='', effect='dark', size='small', :disable-transitions='true', v-if='data.isStaff') 管理员
                el-row.mb-1
                    el-col.key-col(:span='4', :xs='24') 上次登录
                    el-col.mt-2(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                        div(v-if='data.lastLogin') {{toDateTimeString(data.lastLogin)}} ({{data.lastLoginIp}})
                        div(v-else) 无登录记录
                el-row.mb-1
                    el-col.key-col(:span='4', :xs='24') 注册记录
                    el-col.mt-2(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                        = '{{toDateTimeString(data.createTime)}} ('
                        template(v-if='data.createPath == "System"')
                            i.mr-1.el-icon-switch-button
                            = '系统创建'
                        template(v-if='data.createPath == "Admin"')
                            i.mr-1.el-icon-user-solid
                            = '管理员创建'
                        template(v-if='data.createPath == "Code"')
                            i.mr-1.el-icon-key
                            = '注册码注册'
                        template(v-if='data.createPath == "Public"')
                            i.mr-1.el-icon-sunny
                            = '开放注册'
                        = ')'
            el-col(:xs='24', :span='18', v-else)
                el-row.mb-1
                    el-col.key-col(:span='4', :xs='24') 新密码
                    el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                        el-input.mt-1(v-model='password', size='small', type='password')
                el-row.mb-1
                    el-col.key-col(:span='4', :xs='24') 重复密码
                    el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                        el-input.mt-1(v-model='checkPassword', size='small', type='password')
                el-row.m-3
                    el-button(size='small', type='success', @click='onSubmitPassword') 确认修改
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import core from '@/sdk/core';
import userInfo from '@/sdk/modules/user-info';
import adminUser, { UserInfoRes } from '@/sdk/modules/admin-user';
import {Format, Dict} from '@/common/util';

function DEFAULT_DATA(): UserInfoRes {
    return {
        username: '',
        name: '',
        cover: null,
        isStaff: false,
        enable: false,
        lastLogin: null,
        lastLoginIp: null,
        createTime: new Date(),
        createPath: "System"
    };
}

//EVENT: success({mode: "update"|"delete", username: string})
@Component
export default class extends Vue {
    //常量数据
    private readonly EMPTY_AVATAR = require('@/assets/empty_avatar.jpg');
    private readonly spanOfValue = {xs: 24, sm: 20, md: 19, lg: 18};
    //属性
    //变量
    private username: string|null = null;
    private visible: boolean = false;
    private data: UserInfoRes = DEFAULT_DATA();

    private mode: "detail"|"password" = "detail";
    private password: string = '';
    private checkPassword: string = '';
    //compute方法

    //UI事件
    private onChangePassword() {
        if(this.mode == 'detail') {
            this.mode = 'password';
        }else{
            this.mode = 'detail';
        }
    }
    private async onSubmitPassword() {
        let p1 = this.password.trim();
        let p2 = this.checkPassword.trim();
        if(p1 != p2) {
            this.$message.error('两次输入的密码不一致。');
            return;
        }else if(!p1) {
            this.$message.error('输入的密码不能为空。');
            return;
        }
        let res = await adminUser.updateUserPassword(this.username!, p1);
        if(res.ok) {
            this.$message.success('密码修改成功。');
            this.mode = 'detail';
            this.password = '';
            this.checkPassword = '';
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
        }
    }
    private async onDisable() {
        if(await this.$confirm('确认禁用此用户吗？禁用后该用户将被封停。', '严重操作警告', {type: 'warning'})) {
            let res = await adminUser.updateUserStatus(this.username!, false);
            if(res.ok) {
                this.data.enable = false;
                this.$emit('change', {mode: "update", username: this.username});
            }else{
                this.$notify.error({
                    title: '错误',
                    message: res.data,
                    duration: 0
                });
            }
        }
    }
    private async onEnable() {
        if(await this.$confirm('确认启用此用户吗？启用后该用户的封停将被解除。', '严重操作警告', {type: 'success'})) {
            let res = await adminUser.updateUserStatus(this.username!, true);
            if(res.ok) {
                this.data.enable = true;
                this.$emit('change', {mode: "update", username: this.username});
            }else{
                this.$notify.error({
                    title: '错误',
                    message: res.data,
                    duration: 0
                });
            }
        }
    }
    private async onDelete() {
        this.$notify.error({
            title: '不受支持的功能',
            message: '删除用户功能当前不被后端服务支持。'
        });
    }
    //组件方法
    open(username: string) {
        this.username = username;
        this.mode = 'detail';
        this.password = '';
        this.checkPassword = '';
        this.visible = true;
        this.data = DEFAULT_DATA();
        this.requestForInfo();
    }
    //业务逻辑
    private async requestForInfo() {
        let res = await adminUser.getUserInfo(this.username!);
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
    private toDateTimeString(date: Date): string {
        return Format.toDateTimeString(date);
    }
}
</script>

<style scoped>
    @import '../style/layout.css';

    .key-col {
        text-align: right;
        line-height: 40px;
        padding-right: 10px;
    }
    .button {
        width: 100%;
        margin: 2px 0
    }
</style>