import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router';
import store, { loginEvent, logoutEvent } from './store';
import config from '@/config';
import core from '@/sdk/core';
import localStorage from '@/sdk/utils/storage';
import userInfo from '@/sdk/modules/user-info';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(ElementUI);

localStorage.setPrefix(config.STORAGE_PREFIX);

core.configure({
    SERVER_URL: config.SERVER_URL,
    EFFECTIVE_TIME: 1000 * 60 * 60 * 24 * 7
})
.addLoginEvent(loginEvent).addLoginEvent(localStorage.getLoginEvent())
.addLogoutEvent(logoutEvent).addLogoutEvent(localStorage.getLogoutEvent())
.load(userInfo)
.loadToken(localStorage.loadStorageToken());

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
