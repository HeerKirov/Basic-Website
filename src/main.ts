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
import userApp from '@/sdk/modules/user-app';
import adminApp from '@/sdk/modules/admin-app';
import adminCode from '@/sdk/modules/admin-code';
import adminSetting from '@/sdk/modules/admin-setting';
import adminUser from '@/sdk/modules/admin-user';
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
.load(userInfo).load(userApp).load(adminApp).load(adminCode).load(adminUser).load(adminSetting)
.loadToken(localStorage.loadStorageToken());

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
