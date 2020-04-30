<template lang="pug">
    el-card.card
        div.mb-2.mt-2
            el-link(:href='href', target='_blank', @click='onClickTitle') 
                h3.mt-0.mb-1 {{title}}
            el-tooltip.item(v-if='unPublic', effect='dark', content='非公开', placement='right')
                span.el-icon-lock.ml-1
        div.description {{description}}
        el-link.link(v-for='(item, index) in otherURL', :key='item.name', :href='item.href', target='_blank') 
            span.el-icon-link
            = '{{item.name}}'
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

//EVENT: title-click({appId: string})
@Component
export default class TopBar extends Vue {
    @Prop() private appId!: string;
    @Prop() private title!: string;
    @Prop() private url!: {[t: string]: string};
    @Prop() private description!: string;
    @Prop() private unPublic!: boolean;

    private get href(): string|null {
        return this.url ? this.url['index'] : null;
    }
    private get otherURL(): {name: string, href: string}[] {
        let urls: {name: string, href: string}[] = [];
        if(this.url) {
            for(let item in this.url) {
                if(item != 'index') {
                    urls.push({name: item, href: this.url[item]});
                }
            }
        }
        return urls;
    }

    private onClickTitle() {
        if(this.appId) {
            this.$emit('title-click', {appId: this.appId});
        }
    }
}
</script>

<style scoped>
    @import '../style/layout.css';

    .card {
        margin: 6px;
        padding-bottom: 6px;
        position: relative;
    }
    .description {
        font-size: 13px;
        margin-bottom: 4px;
    }
    .link {
        font-size: 10px;
        margin-right: 5px
    }
</style>