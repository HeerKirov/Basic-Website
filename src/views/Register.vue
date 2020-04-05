<template lang='pug'>
  div
    el-card.box
      div.title
        h3 - 新用户注册 -
      el-input.mt-2.mb-2(placeholder='用户名', v-model='username')
      el-input.mb-4(placeholder='昵称', v-model='name')
      el-input.mb-2(placeholder='密码', show-password, v-model='password')
      el-input.mb-4(placeholder='请重复密码', show-password, v-model='passwordRepeat')
      el-input.mb-4(placeholder='注册码', v-model='code')
      el-row.mb-2
        el-col(:span='7')
          el-button(type='primary', @click='onRegister') 
            i.el-icon-right.left-icon
            = '注册'
        el-col(:span='17')
          el-alert(type='error', v-if='alert', :title='alert', :closable='false')
    CaseNumber.bottom-case-number
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import CaseNumber from '@/components/CaseNumber.vue';
import {Dict} from '@/common/util';
import core, {REGISTER_REV, TOKEN_CREATE_REV} from '@/sdk/core';

const REGISTER_ALERT: Dict<string> = {
    DISABLED_REGISTRATION_CODE: '注册码已经失效',
    NEED_REGISTRATION_CODE: '注册功能被限制，请输入注册码',
    USERNAME_EXIST: '用户名已被使用',
    REGISTER_CLOSED: '注册功能已关闭',

    USERNAME_EMPTY: '用户名不能为空',
    NAME_EMPTY: '昵称不能为空',
    PASSWORD_EMPTY: '密码不能为空',
    PASSWORD_WRONG: '两次输入的密码不一致'
};

@Component({components: {CaseNumber}})
export default class extends Vue {
    //变量数据
    private username: string = '';
    private name: string = '';
    private password: string = '';
    private passwordRepeat: string = '';
    private code: string = '';
    private alert: string|null = null;
    private loading: boolean = false;
    //vue事件
    private beforeCreate() {
        //如果已经登录，那么重定向到主页。
        if(this.$store.state.user.isLogin) {
            this.$router.push({name: 'home'});
        }
    }
    //UI事件
    private async onRegister() {
        /**事件：按下注册按钮。 */
        if(!this.validate()) {
            return;
        }
        this.loading = true;
        let res = await core.register({username: this.username, password: this.password, name: this.name, code: this.code||null});
        if(res.ok) {
            let res = await core.login({username: this.username, password: this.password});
            if(res.ok) {
                this.$router.push({name: 'home'});
            }else{
                this.alert = res.data;
            }
        }else{
            this.alert = REGISTER_ALERT[REGISTER_REV[res.data]] || res.data;
        }
        this.loading = false;
    }
    //业务逻辑
    private validate() {
        /**验证要提交的表单，并更新错误提示。*/
        this.alert = null;
        this.alert = null;
        if(!this.username) {
            this.alert = REGISTER_ALERT.USERNAME_EMPTY;
            return false;
        }
        if(!this.name) {
            this.alert = REGISTER_ALERT.NAME_EMPTY;
            return false;
        }
        if(!this.password) {
            this.alert = REGISTER_ALERT.PASSWORD_EMPTY;
            return false;
        }
        if(this.password != this.passwordRepeat) {
            this.alert = REGISTER_ALERT.PASSWORD_WRONG;
            return false;
        }
        return true;
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
  .bottom-case-number {
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%)
  }
</style>
