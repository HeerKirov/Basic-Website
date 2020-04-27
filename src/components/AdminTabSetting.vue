<template lang="pug">
    el-form.m-4(label-width='150px', label-position='left')
        el-form-item(label='注册模式')
            el-select(v-model='data.registerMode', size='small')
                el-option(label='关闭注册', value='Close')
                el-option(label='仅激活码注册', value='Code')
                el-option(label='开放注册', value='Open')
        el-form-item(label='Token默认时长(ms)')
            el-input.effective-input(v-model='data.effectiveDefault', size='small')
        el-form-item(label='Token最大时长(ms)')
            el-input.effective-input(v-model='data.effectiveMax', size='small')
        el-button(@click='onSubmit', type='primary', icon='el-icon-check', size='small') 保存设置
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import core from '@/sdk/core';
import adminSetting, { Setting } from '../sdk/modules/admin-setting';

@Component
export default class extends Vue {
    private data: any = {
        registerMode: "Close",
        effectiveMax: null,
        effectiveDefault: 0
    };

    //vue事件
    private mounted() {
        this.requestForInfo();
    }
    //UI事件
    private async onSubmit() {
        let body = this.validate();
        if(body != null) {
            let res = await adminSetting.update(body);
            if(res.ok) {
                this.$notify.success({
                    title: '提示',
                    message: '保存成功。',
                    duration: 3000
                });
            }else{
                this.$notify.error({
                    title: '错误',
                    message: res.data,
                    duration: 0
                });
            }
        }
    }

    //业务逻辑
    private validate(): Setting|null {
        let setting: Setting = {registerMode: "Close", effectiveMax: 0, effectiveDefault : 0};
        if(!this.data.effectiveMax) {
            setting.effectiveMax = null;
        }else try {
            setting.effectiveMax = parseInt(this.data.effectiveMax);
        }catch(e) {
            this.$message.error('最大时长必须是数字。')
            return null;
        }
        try {
            setting.effectiveDefault = parseInt(this.data.effectiveDefault);
        }catch(e) {
            this.$message.error('默认时长必须是数字。')
            return null;
        }
        setting.registerMode = this.data.registerMode;
        return setting;
    }
    private async requestForInfo() {
        let res = await adminSetting.get();
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
}
</script>

<style scoped>
    @import '../style/layout.css';

    .effective-input {
        width: 150px
    }
</style>