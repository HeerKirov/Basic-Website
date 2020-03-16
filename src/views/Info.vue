<template lang='pug'>
    el-row
        el-col.content(:xs='xs', :sm='sm', :md='md', :lg='lg')
            img.avatar(:src='userCoverURL')
            h3.mt-2.mb-0 {{data.name}}
            div.f-15 
                span @{{data.username}}
                el-link.ml-2(href='#/admin', v-if='data.is_staff')
                    i.el-icon-s-custom
                    = '系统管理员'
            div.f-13.mt-4
                span.mr-1 上次登录
                span {{toDateTimeString(data.last_login)}}
            div.f-13
                span.mr-1 注册时间
                span {{toDateTimeString(data.create_time)}}
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Dict, Format} from '@/common/util';
import core, {TOKEN_CREATE_REV} from '@/sdk/core';
import userInfo, {UserInfoRes} from '@/sdk/modules/user-info';

@Component
export default class extends Vue {
    private readonly EMPTY_AVATAR = require('@/assets/empty_avatar.jpg');
    private readonly xs = 24;
    private readonly sm = {span: 16, offset: 4};
    private readonly md = {span: 14, offset: 5};
    private readonly lg = {span: 12, offset: 6};

    private data: any = {};

    private get userCoverURL() {
        return this.data.cover ? userInfo.getCoverURL(this.data.cover) : this.EMPTY_AVATAR;
    }

    private async mounted() {
        await this.requestForInfo();
    }

    private async requestForInfo() {
        let res = await userInfo.getUserInfo();
        if(res.ok) {
            this.data = res.data;
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,//TODO 添加一套通用的解释错误信息的函数并用在这里
                duration: 0
            });
        }
    }

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
    .name {
        margin-top: 10px;
        margin-bottom: 0;
    }
    .f-15 {
        font-size: 15px;
    }
    .f-13 {
        font-size: 13px
    }
</style>