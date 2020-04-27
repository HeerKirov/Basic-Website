export default {
    state: {
        isLogin: null,
        username: null,
        name: null,
        cover: null,
        isStaff: null,

        token: null,
        expireTime: null,
        updateTime: null
    },
    getters: {
        userInfo(state: any) {
            return {
                username: state.username,
                name: state.name,
                cover: state.cover,
                isStaff: state.isStaff
            }
        },
        token(state: any) {
            return {
                token: state.token,
                expireTime: state.expireTime,
                updateTime: state.updateTime
            }
        }
    },
    mutations: {
        updateToken(state: any, body: {token: string, expireTime: Date, updateTime: Date}) {
            state.token = body.token;
            state.expireTime = body.expireTime;
            state.updateTime = body.updateTime;
            if(!state.isLogin) {
                state.isLogin = true;
            }
        },
        updateUserInfo(state: any, body: {username?: string, name?: string, cover?: string, isStaff?: boolean}) {
            if(body.username != undefined) {
                state.username = body.username;
            }
            if(body.name != undefined) {
                state.name = body.name;
            }
            if(body.cover != undefined) {
                state.cover = body.cover;
            }
            if(body.isStaff != undefined) {
                state.isStaff = body.isStaff;
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
            state.expireTime = null;
            state.updateTime = null;
        }
    },
    actions: {
        
    }
}