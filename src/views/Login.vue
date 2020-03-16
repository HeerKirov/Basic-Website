<template lang='pug'>
  el-card.box
    div.title
      h3 - 登录 -
    el-input.mt-2.mb-4(placeholder='请输入用户名', v-model='username')
    el-input.mb-4(placeholder='请输入密码', show-password, v-model='password')
    el-row.mb-2
      el-col(:span='7')
        el-button(type='success', @click='onLogin', :loading='loading') 
          i.el-icon-right.left-icon
          = '登录'
      el-col(:span='17')
        el-alert(type='error', :title='alert', v-if='alert', :closable='false')
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Dict} from '@/common/util';
import core, {TOKEN_CREATE_REV} from '@/sdk/core';

const LOGIN_ALERT: Dict<string> = {
    PASSWORD_WRONG: '密码错误',
    USER_NOT_EXIST: '用户不存在',
    USER_NOT_ENABLED: '该用户已停用',

    USERNAME_EMPTY: '用户名不能为空',
    PASSWORD_EMPTY: '密码不能为空'
};

@Component
export default class extends Vue {
    username: string = '';
    password: string = '';
    alert: string|null = null;
    loading: boolean = false;

    private beforeCreate() {
        //如果已经登录，那么重定向到主页。
        if(this.$store.state.user.isLogin) {
            this.$router.push({name: 'home'});
        }
    }

    private validate(): boolean {
        /**验证要提交的表单，并更新错误提示。*/
        this.alert = null;
        if(!this.username) {
            this.alert = LOGIN_ALERT.USERNAME_EMPTY;
            return false;
        }
        if(!this.password) {
            this.alert = LOGIN_ALERT.PASSWORD_EMPTY;
            return false;
        }
        return true;
    }

    private async onLogin() {
        /**事件：按下登录按钮。*/
        if(!this.validate()) {
            return;
        }
        this.loading = true;
        let res = await core.login({username: this.username, password: this.password});
        if(res.ok) {
            this.$router.push({name: 'home'});
        }else{
            this.alert = LOGIN_ALERT[TOKEN_CREATE_REV[res.data]] || res.data;
        }
        this.loading = false;
    }
}
</script>

<style scoped>
  @import '../style/layout.css';

  .box {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 400px;
    transform: translate(-50%, -50%)
  }
  .title {
    text-align: center
  }
  .left-icon {
    padding-right: 5px
  }
</style>
