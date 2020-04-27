<template lang="pug">
    el-dialog(:visible.sync='visible', :title='dialogTitle')
        el-row.mb-1
            el-col.key-col(:span='4', :xs='24') app ID
            el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                div.mt-2(v-if='mode == "detail"') 
                    i {{data.appId}}
                el-input(v-else, v-model='data.appId', placeholder='应用程序的唯一标识名')
        el-row.mb-1
            el-col.key-col(:span='4', :xs='24') 应用名称
            el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                div.mt-2(v-if='mode == "detail"') 
                    b {{data.name}}
                el-input(v-else, v-model='data.name', placeholder='应用程序的展示名称')
        el-row.mb-1
            el-col.key-col(:span='4', :xs='24') 描述
            el-col(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                div.mt-2(v-if='mode == "detail"') {{data.description}}
                el-input(v-else, v-model='data.description', type='textarea', :autosize='{minRows: 2}', placeholder='应用程序的简要描述')
        el-row.mb-1
            el-col.key-col(:span='4', :xs='24') 链接
            el-col.mt-2(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                template(v-if='mode == "detail"')
                    div.mb-1
                        el-tag.mb-1(type='success', size='small', :disable-transitions='true', v-if='homeURL') 主页
                        el-link.ml-1(:href='homeURL', target='_blank') {{homeURL}}
                    div.mb-1(v-for='(item, index) in otherURL', :key='item.key')
                        el-tag(type='info', size='small', :disable-transitions='true') {{item.key}}
                        el-link.ml-1(:href='item.value', target='_blank') {{item.value}}
                template(v-else)
                    div.mb-1
                        el-input(v-model='homeURL', placeholder='主页链接地址')
                    el-row.mb-1(v-for='(item, index) in otherURL', type='flex', justify='space-between')
                        el-input.url-edit-key(v-model='item.key', placeholder='链接名称')
                        el-input.url-edit-value(v-model='item.value', placeholder='链接地址')
                        el-button.url-edit-del(type='danger', icon='el-icon-delete', @click='onRemoveLink(index)')
                    el-row.mb-1
                        el-button.url-edit-add(type='success', icon='el-icon-plus', @click='onAddLink') 添加额外的链接项
        el-row.mb-1
            el-col.key-col(:span='4', :xs='24') 可用性
            el-col.mt-2(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                template(v-if='mode == "detail"')
                    el-tag.mr-1(type='success', effect='dark', size='small', :disable-transitions='true', v-if='data.public') 公开
                    el-tag.mr-1(type='info', effect='plain', size='small', :disable-transitions='true', v-else) 非公开
                    el-tag.mr-1(type='primary', effect='plain', size='small', :disable-transitions='true', v-if='data.enable') 可用
                    el-tag.mr-1(type='danger', effect='dark', size='small', :disable-transitions='true', v-else) 禁用
                template(v-else)
                    el-switch.mr-1(active-text='公开', active-color="#13ce66", v-model='data.public')
                    el-switch(active-text='可用', inactive-color="#ff4949", v-model='data.enable', v-if='mode == "edit"')
        el-row.mb-1(v-if='mode == "detail"')
            el-col.key-col(:span='4', :xs='24') 创建时间
            el-col.mt-2(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg') {{toDateTimeString(data.createTime)}}
        el-row.mb-1(v-if='mode == "detail"')
            el-col.key-col(:span='4', :xs='24') 上次更新
            el-col.mt-2(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg') {{toDateTimeString(data.updateTime)}}
        el-row.mb-1(v-if='mode == "detail"')
            el-col.key-col(:span='4', :xs='24') app SECRET
            el-col.mt-1(:xs='spanOfValue.xs', :sm='spanOfValue.sm', :md='spanOfValue.md', :lg='spanOfValue.lg')
                div.secret
                    div.secret-content {{secret || '******'}}
                    el-button.secret-button(icon='el-icon-s-opportunity', size='mini', type='primary', @click='onShowSecret', v-if='!secret')
                    el-tooltip.item(effect='dark', placement='right', content='重置app SECRET', v-else)
                        el-button.secret-button(icon='el-icon-edit-outline', size='mini', type='info', @click='onUpdateSecret')

        span(slot='footer')
            template(v-if='mode == "detail"')
                el-button(type='danger', icon='el-icon-delete', size='small', @click='onDelete') 删除
                el-button(type='primary', icon='el-icon-edit', size='small', @click='onEdit') 编辑
            template(v-else)
                el-button(type='primary', icon='el-icon-check', size='small', @click='onSubmit') 提交

</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import core from '@/sdk/core';
import adminApp, {AppInfoRes, AppUpdateReq, AppSecretRes, AppCreateReq, AppBaseReq} from '@/sdk/modules/admin-app';
import {Format, Dict} from '@/common/util';

function DEFAULT_DATA(): AppInfoRes {
    return {
        appId: '',
        name: '',
        description: '',
        url: {},
        public: false,
        enable: true,
        createTime: new Date(),
        updateTime: new Date()
    };
}

//EVENT: change({mode: "new"|"edit"|"delete", appId: string})
@Component
export default class extends Vue {
    //常量数据
    private readonly spanOfValue = {xs: 24, sm: 20, md: 19, lg: 18};
    //属性
    //变量
    private mode: "new"|"edit"|"detail" = "new";
    private appId: string|null = null;
    private visible: boolean = false;
    private data: AppInfoRes = DEFAULT_DATA();
    private homeURL: string = '';
    private otherURL: {key: string, value: string}[] = [];
    private secret: string|null = null;
    //compute方法
    private get dialogTitle() {
        if(this.mode == "new") return "新建应用程序";
        else if(this.mode == "edit") return "编辑应用程序";
        else return "应用程序";
    }
    //UI事件
    private onEdit() {
        if(this.mode == 'detail') {
            this.mode = 'edit';
        }
    }
    private async onSubmit() {
        if(this.mode == 'new') {
            let body = this.validate();
            if(body != null && await this.createItem({...body, appId: this.data.appId.trim()})) {
                this.visible = false;
                this.$emit('change', {mode: "new", appId: this.appId});
            }
        }else{
            let body = this.validate();
            if(body != null && await this.updateItem({...body, enable: this.data.enable})) {
                this.mode = 'detail';
                this.$emit('change', {mode: "edit", appId: this.appId});
            }
        }
    }
    private onDelete() {
        this.$confirm('确认要删除应用程序吗？这将使关联的应用程序失效，且操作无法撤销。', '严重操作警告', {type: 'warning'})
        .catch(_ => {})
        .then(async confirm => {
            if(confirm) {
                let res = await adminApp.deleteApp(this.appId!);
                if(res.ok) {
                    this.$emit('change', {mode: "delete", appId: this.appId});
                    this.visible = false;
                }else{
                    this.$notify.error({
                        title: '错误',
                        message: res.data,
                        duration: 0
                    });
                }
            }
        });
    }
    private onAddLink() {
        this.otherURL.push({key: '', value: ''});
    }
    private onRemoveLink(index: number) {
        this.otherURL.splice(index, 1);
    }
    private async onShowSecret() {
        await this.requestForSecret();
    }
    private onUpdateSecret() {
        this.$confirm('确认要更换app SECRET吗？这将使已配置的应用程序失效，需要重新配置，且操作无法撤销。', '严重操作警告', {type: 'warning'})
        .catch(_ => {})
        .then(confirm => {
            if(confirm) {
                this.updateSecret();
            }
        })
    }
    //组件方法
    public open(appId?: string) {
        /** 根据传入的appId是否存在，决定本次打开dialog是什么模式。 */
        if(!this.visible) {
            this.data = DEFAULT_DATA();
            this.homeURL = '';
            this.otherURL = [];
            this.secret = null;
            if(appId == null) {
                this.mode = "new";
                this.appId = null;
            }else{
                this.mode = "detail";
                this.appId = appId;
                this.requestForInfo();
            }
            this.visible = true;
        }
    }
    //业务逻辑
    private validate(): AppBaseReq|null {
        if(!this.data.appId || !this.data.appId.trim()) {
            this.$message.error('appId不能为空。');
            return null;
        }
        if(!this.data.name || !this.data.name.trim()) {
            this.$message.error('应用名称不能为空。');
            return null;
        }
        let url: Dict<string> = {};
        for(let {key, value} of this.otherURL) {
            if(!key || !key.trim()) {
                this.$message.error('链接名称不能为空。');
                return null;
            }else if(!key && key.trim() == 'index') {
                this.$message.error('"index"是内置的链接名称，不能使用。');
                return null;
            }else if(!value || !value.trim()) {
                this.$message.error('链接地址不能为空。');
                return null;
            }
            url[key.trim()] = value.trim();
        }
        if(this.homeURL != null && this.homeURL.trim()) {
            url['index'] = this.homeURL.trim();
        }
        return {
            name: this.data.name.trim(),
            description: this.data.description,
            public: this.data.public,
            url
        };
    }
    private async createItem(req: AppCreateReq): Promise<boolean> {
        let res = await adminApp.createApp(req)
        if(res.ok) {
            this.appId = res.data.appId;
            return true;
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
            return false;
        }
    }
    private async updateItem(req: AppUpdateReq) {
        let res = await adminApp.updateApp(this.appId!, req);
        if(res.ok) {
            return true;
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
            return false;
        }
    }
    private async requestForInfo() {
        let res = await adminApp.getAppDetail(this.appId!);
        if(res.ok) {
            this.data = res.data;
            this.homeURL = res.data.url['index'];
            let otherURL: {key: string, value: string}[] = [];
            for(let key in res.data.url) {
                if(key != 'index') {
                    otherURL.push({key, value: res.data.url[key]});
                }
            }
            this.otherURL = otherURL;
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
        }
    }
    private async requestForSecret() {
        let res = await adminApp.getAppSecret(this.appId!);
        if(res.ok) {
            this.secret = res.data.secret;
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
        }
    }
    private async updateSecret() {
        let res = await adminApp.updateAppSecret(this.appId!);
        if(res.ok) {
            this.secret = res.data.secret;
        }else{
            this.$notify.error({
                title: '错误',
                message: res.data,
                duration: 0
            });
        }
    }
    //工具函数
    private toDateTimeString(date: Date): string {
        return Format.toDateTimeString(date);
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
    .url-edit-key {
        width: calc((100% - 56px) * 0.3 - 5px)
    }
    .url-edit-value {
        width: calc((100% - 56px) * 0.7)
    }
    .url-edit-del {
        width: 56px
    }
    .url-edit-add {
        width: 100%
    }
    .secret {
        background-color: lightgray;
        border-radius: 5px;
        padding: 4px;
    }
    .secret-content {
        width: calc(100% - 56px);
        display: inline-block;
        padding-left: 5px;
        box-sizing: border-box;
        font-size: 12px
    }
    .secret-button {
        width: 56px;
        display: inline-block;
        box-sizing: border-box;
    }
</style>