<template lang="pug">
    el-dialog(:visible.sync='visible', title='用户详情')
        el-row.mb-0
            el-col.key-col(:span='4', :xs='24') 用户名
            el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                el-input(size='small', v-model='data.username')
        el-row.mb-2
            el-col.key-col(:span='4', :xs='24') 昵称
            el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                el-input(size='small', v-model='data.name')
        el-row.mb-0
            el-col.key-col(:span='4', :xs='24') 密码
            el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                el-input(size='small', v-model='data.password', type='password')
        el-row.mb-2
            el-col.key-col(:span='4', :xs='24') 重复密码
            el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                el-input(size='small', v-model='data.checkPassword', type='password')
        el-row
            el-col.key-col(:span='4', :xs='24') 管理员身份
            el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                el-switch.mt-2(active-color="#13ce66", v-model='data.isStaff')
        span(slot='footer')
            el-button(type='primary', icon='el-icon-check', size='small', @click='onSubmit') 提交
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import core from '@/sdk/core';
import userInfo from '@/sdk/modules/user-info';
import adminUser, { UserInfoRes, CreateUserInfoReq } from '@/sdk/modules/admin-user';
import {Format, Dict} from '@/common/util';

type CreateForm = CreateUserInfoReq & {checkPassword: string}

function DEFAULT_DATA(): CreateForm {
    return {
        username: '',
        name: '',
        isStaff: false,
        password: '',
        checkPassword: ''
    };
}

//EVENT: success({username: string})
@Component
export default class extends Vue {
    //常量数据
    private readonly spanOfValue = {xs: 24, sm: 20, md: 19, lg: 18};
    //属性
    //变量
    private visible: boolean = false;
    private data: CreateForm = DEFAULT_DATA();
    //compute方法
    //UI事件
    private async onSubmit() {
        let req = this.validate();
        if(req != null) {
            let res = await adminUser.createUser(req);
            if(res.ok) {
                this.visible = false;
                this.$emit('success', {username: res.data.username});
            }else{
                this.$notify.error({
                    title: '错误',
                    message: res.data,
                    duration: 0
                });
            }
        }
    }
    //组件方法
    open() {
        this.data = DEFAULT_DATA();
        this.visible = true;
    }
    //业务逻辑
    private validate(): CreateUserInfoReq|null {
        if(!this.data.username || !this.data.username.trim()) {
            this.$message.error('用户名不能为空。');
            return null;
        }
        if(!this.data.name || !this.data.name.trim()) {
            this.$message.error('昵称不能为空。');
            return null;
        }
        if(this.data.password.trim() != this.data.checkPassword.trim()) {
            this.$message.error('两次输入的密码不一致。');
            return null;
        }else if(!this.data.password.trim()) {
            this.$message.error('密码不能为空。');
            return null;
        }

        return {
            username: this.data.username.trim(),
            name: this.data.name.trim(),
            password: this.data.password.trim(),
            isStaff: this.data.isStaff
        };
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
</style>