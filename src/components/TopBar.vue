<template lang='pug'>
  div.top-bar.noselect
    div.left
        el-link(href='/', :underline='false') HEERKIROV.COM
    div.right(v-if='!isLogin')
        el-link.button(href='/login') 登录
        el-link.button(href='/register') 注册
    div.right(v-else)
        el-link(href='/user-info')
            img.avatar(:src='userCoverURL')
            span.hidden-xs-only {{userInfo.name}}
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import userInfo from '@/sdk/modules/user-info';
import 'element-ui/lib/theme-chalk/display.css';

@Component
export default class TopBar extends Vue {
    private readonly EMPTY_AVATAR = require('@/assets/empty_avatar.jpg');

    private get isLogin(): boolean {
        return this.$store.state.user.isLogin;
    }
    private get userInfo() {
        return this.$store.getters.userInfo;
    }
    private get userCoverURL() {
        return this.$store.state.user.cover ? userInfo.getCoverURL(this.$store.state.user.cover) : this.EMPTY_AVATAR;
    }
}
</script>

<style scoped>
    @import '../style/util.css';

    .top-bar {
        height: 60px;
        line-height: 60px;
    }
    .left {
        float: left;
        border-bottom: double #409EFF 1px;
    }
    .right {
        float: right;
    }
    .button {
        width: 60px;
    }
    .avatar {
        height: 36px;
        width: 36px;
        transform: translateY(35%);
        border-radius: 50%;
        margin-right: 4px;
    }
</style>
