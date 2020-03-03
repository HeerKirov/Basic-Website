<template lang='pug'>
  el-card.box
    div.title
      h3 - 登录 -
    el-input.mt-2.mb-4(placeholder='请输入用户名')
    el-input.mb-4(placeholder='请输入密码', show-password)
    el-row.mb-2
      el-col(:span='7')
        el-button(type='success') 
          i.el-icon-right.left-icon
          = '登录'
      el-col(:span='17')
        el-alert(type='error', title='{错误提示}')
</template>



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
