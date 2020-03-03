<template lang='pug'>
  el-card.box
    div.title
      h3 - 新用户注册 -
    el-input.mt-2.mb-2(placeholder='用户名')
    el-input.mb-4(placeholder='昵称')
    el-input.mb-2(placeholder='密码', show-password)
    el-input.mb-4(placeholder='请重复密码', show-password)
    el-input.mb-4(placeholder='注册码')
    el-row.mb-2
      el-col(:span='7')
        el-button(type='primary') 
          i.el-icon-right.left-icon
          = '注册'
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
