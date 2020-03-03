<template lang='pug'>
  div.top-bar
    div.left
      el-link(href='#/', :type='undefined', :underline='false') HEERKIROV.COM
    div.right
      el-link.button(href='#/login') 登录
      el-link.button(href='#/register') 注册
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TopBar extends Vue {
  @Prop() private msg!: string;
  
}
</script>

<style scoped>
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
</style>
