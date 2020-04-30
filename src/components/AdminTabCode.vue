<template lang="pug">
    div
        el-row
            div.float-right
                el-button(type='success', size='mini', icon='el-icon-plus', @click='onCreate') 新建
        el-row.m-4
            el-table(:data='data')
                el-table-column(label='CODE')
                    template(slot-scope='scope')
                        span {{scope.row.code}}
                el-table-column(label='已用', width='75')
                    template(slot-scope='scope')
                        i.el-icon-check(v-if='scope.row.usedTime')
                el-table-column(label='可用', width='75')
                    template(slot-scope='scope')
                        i.el-icon-check(v-if='scope.row.enable')
                el-table-column(label='使用期限')
                    template(slot-scope='scope') {{toDateTimeString(scope.row.deadline)}}
                el-table-column(label='创建时间')
                    template(slot-scope='scope') {{toDateTimeString(scope.row.createTime)}}
                el-table-column
                    template(slot-scope='scope')
                        el-link(@click='onModify(scope.row)', :disabled='!scope.row.enable') 更改
        el-dialog(:visible.sync='createData.visible', title='新建激活码')
            el-row.mb-2 创建一个新的激活码。激活码的内容由系统自动指定。
            el-row
                el-col.key-col(:span='4', :xs='24') 使用期限
                el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                    el-date-picker(type='datetime', placeholder='截止时间后激活码自动失效', size='small', v-model='createData.deadline')
            span(slot='footer')
                el-button(type='primary', icon='el-icon-check', size='small', @click='onCreateSubmit') 创建
        el-dialog(:visible.sync='modifyData.visible', title='更改')
            el-row.mb-2
                el-col.key-col(:span='4', :xs='24') 使用期限
                el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                    el-date-picker(type='datetime', placeholder='截止时间后激活码自动失效', size='small', v-model='modifyData.deadline')
            el-row.mb-2
                el-col.key-col(:span='4', :xs='24') 可用
                el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                    el-switch(v-model='modifyData.enable')
            span(slot='footer')
                el-button(type='primary', icon='el-icon-check', size='small', @click='onModifySubmit') 提交
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Dict, Format} from '@/common/util';
import core from '@/sdk/core';
import adminCode, { CodeRes } from '@/sdk/modules/admin-code';

@Component
export default class extends Vue {
    private readonly spanOfValue = {xs: 24, sm: 20, md: 19, lg: 18};
    //变量
    private data: CodeRes[] = [];
    private createData: {visible: boolean, deadline: Date|null} = {
        visible: false,
        deadline: null
    };
    private modifyData: {visible: boolean, deadline: Date|null, enable: boolean, id: number} = {
        visible: false,
        deadline: null,
        enable: true,
        id: 0
    };
    //vue事件
    private mounted() {
        this.requestForList();
    }
    //UI事件
    private onCreate() {
        this.createData.visible = true;
    }
    private async onCreateSubmit() {
        let res = await adminCode.createCode(this.createData.deadline);
        if(res.ok) {
            this.createData.visible = false;
            this.requestForList();
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
        }
    }
    private onModify(data: CodeRes) {
        this.modifyData.deadline = data.deadline;
        this.modifyData.enable = data.enable;
        this.modifyData.id = data.id;
        this.modifyData.visible = true;
    }
    private async onModifySubmit() {
        let res = await adminCode.updateCode(this.modifyData.id, {
            deadline: this.modifyData.deadline,
            enable: this.modifyData.enable
        });
        if(res.ok) {
            this.modifyData.visible = false;
            this.requestForList();
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
        }
    }
    //业务逻辑
    private async requestForList() {
        let res = await adminCode.getCodeList();
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
    private toDateTimeString(d?: Date): string {
        return Format.toDateTimeString(d);
    }
}
</script>

<style scoped>
    @import '../style/layout.css';
</style>