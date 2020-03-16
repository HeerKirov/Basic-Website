import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import {Auth} from '@/sdk/core';
import userInfo from '@/sdk/modules/user-info';

Vue.use(Vuex);

export async function loginEvent(auth?: Auth) {
    store.commit('updateToken', {
        token: auth!.token,
        expire_time: auth!.expire_time,
        update_time: auth!.update_time
    });
    let info = await userInfo.getUserInfo();
    if(info.ok) {
        store.commit('updateUserInfo', {
            username: info.data.username,
            name: info.data.name,
            cover: info.data.cover,
            is_staff: info.data.is_staff
        })
    }
}

export function logoutEvent() {
    store.commit('clear');
}

const store = new Vuex.Store({
    modules: {
        user
    }
});

export default store;