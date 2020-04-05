export default {
    state: {
        isLogin: null,
        username: null,
        name: null,
        cover: null,
        is_staff: null,

        token: null,
        expire_time: null,
        update_time: null
    },
    getters: {
        userInfo(state: any) {
            return {
                username: state.username,
                name: state.name,
                cover: state.cover,
                is_staff: state.is_staff
            }
        },
        token(state: any) {
            return {
                token: state.token,
                expire_time: state.expire_time,
                update_time: state.update_time
            }
        }
    },
    mutations: {
        updateToken(state: any, body: {token: string, expire_time: Date, update_time: Date}) {
            state.token = body.token;
            state.expire_time = body.expire_time;
            state.update_time = body.update_time;
            if(!state.isLogin) {
                state.isLogin = true;
            }
        },
        updateUserInfo(state: any, body: {username?: string, name?: string, cover?: string, is_staff?: boolean}) {
            if(body.username != undefined) {
                state.username = body.username;
            }
            if(body.name != undefined) {
                state.name = body.name;
            }
            if(body.cover != undefined) {
                state.cover = body.cover;
            }
            if(body.is_staff != undefined) {
                state.is_staff = body.is_staff;
            }
            if(!state.isLogin) {
                state.isLogin = true;
            }
        },
        clear(state: any) {
            state.isLogin = false;
            state.username = null;
            state.name = null;
            state.cover = null;
            state.token = null;
            state.expire_time = null;
            state.update_time = null;
        }
    },
    actions: {
        
    }
}