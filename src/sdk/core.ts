import axios, {AxiosResponse} from 'axios';
import Listener from './utils/listener';
import {CommonResult} from './modal';
import { reverse } from './utils/util';

export interface Configuration {
    SERVER_URL: string
    EFFECTIVE_TIME: number|null
}

export interface Auth {
    token: string
    username?: string
    expireTime?: Date
    updateTime?: Date
}

function result<R>(response: AxiosResponse<any>): CommonResult<R> {
    return response.status < 300 ? {
        ok: true,
        status: response.status,
        data: response.data
    } : {
        ok: false,
        status: response.status,
        data: response.data
    }
}

export function trans<T, R>(r: CommonResult<T>, translate: (t: T) => R): CommonResult<R> {
    return r.ok ? {
        ok: true,
        status: r.status,
        data: translate(r.data)
    } : {
        ok: false,
        status: r.status,
        data: r.data
    };
}

//TODO 添加token自动刷新和更新机制
class Core {
    config: Configuration = {
        SERVER_URL: 'http://basic-service',
        EFFECTIVE_TIME: null
    };
    auth: Auth|null = null;

    private loginEvent: Listener<Auth> = new Listener();
    private logoutEvent: Listener<null> = new Listener();
    
    //配置部分
    configure(configuration: Configuration): Core {
        this.config = configuration;
        return this;
    }
    load(...module: CoreModule[]): Core {
        for(let m of module) {
            m.core = {
                getURL: url => this.config.SERVER_URL + url,
                requestForGet: async (u, p) => await this.requestForGet(u, p),
                requestForPost: async (u, d) => await this.requestForPost(u, d),
                requestForPut: async (u, d) => await this.requestForPut(u, d),
                requestForDelete: async (u) => await this.requestForDelete(u)
            };
        }
        return this;
    }

    //面向用户的登录工具
    isLogin(): boolean {
        return this.auth != null;
    }
    async loadToken(token: string|null): Promise<CommonResult<null>> {
        if(token) {
            this.auth = {token};
            let res = await this.getToken(token);
            if(res.ok) {
                this.auth = {
                    token: res.data.key,
                    username: res.data.username,
                    expireTime: new Date(res.data.expire_time),
                    updateTime: new Date(res.data.update_time)
                };
                this.loginEvent.emit(this.auth);
            }else{
                this.logoutEvent.emit();
            }
            return trans(res, () => null);
        }else{
            this.logoutEvent.emit();
            return new Promise((resolve, _) => resolve({
                ok: true,
                data: null,
                status: 200
            }));
        }
    }
    async login(req: LoginReq): Promise<CommonResult<null>> {
        let res = await this.createToken({
            ...req,
            effective: this.config.EFFECTIVE_TIME,
            effective_unlimit: this.config.EFFECTIVE_TIME == null
        });
        if(res.ok) {
            this.auth = {
                token: res.data.key,
                username: res.data.username,
                expireTime: new Date(res.data.expire_time),
                updateTime: new Date(res.data.update_time)
            };
            this.loginEvent.emit(this.auth);
        }
        return trans(res, () => null);
    }
    logout() {
        this.auth = null;
        this.logoutEvent.emit();
    }
    addLoginEvent(call: (auth?: Auth) => void): Core {
        this.loginEvent.addListener(call);
        return this;
    }
    addLogoutEvent(call: (auth?: null) => void): Core {
        this.logoutEvent.addListener(call);
        return this;
    }

    //API部分 
    private async createToken(req: TokenCreateReq): Promise<CommonResult<TokenRetrieveRes>> {
        return await this.requestForPost<TokenRetrieveRes>(`/api/token/`, req);
    }
    private async getToken(token: string): Promise<CommonResult<TokenRetrieveRes>> {
        return await this.requestForGet<TokenRetrieveRes>(`/api/token/${encodeURIComponent(token)}/`);
    }
    private async updateToken(token: string, req: TokenUpdateReq): Promise<CommonResult<TokenRetrieveRes>> {
        return await this.requestForPut<TokenRetrieveRes>(`/api/token/${encodeURIComponent(token)}/`, req);
    }
    async register(req: RegisterReq): Promise<CommonResult<null>> {
        return await this.requestForPost('/api/register/', req);
    }

    //axios adapter部分
    private getHeaders(): any {
        return this.auth ? {'Authorization': `Bearer ${this.auth.token}`} : undefined;
    }
    private async requestForGet<T>(url: string, params?: any): Promise<CommonResult<T>> {
        try {
            return result(await axios.get(this.config.SERVER_URL + url, {params, headers: this.getHeaders()}));
        }catch(e) {
            return {
                ok: false,
                status: e.response.status,
                data: e.response.data
            };
        }
    }
    private async requestForPost<T>(url: string, data?: any): Promise<CommonResult<T>> {
        try {
            return result(await axios.post(this.config.SERVER_URL + url, data, {headers: this.getHeaders()}));
        }catch(e) {
            return {
                ok: false,
                status: e.response.status,
                data: e.response.data
            };
        }
    }
    private async requestForPut<T>(url: string, data?: any): Promise<CommonResult<T>> {
        try {
            return result(await axios.put(this.config.SERVER_URL + url, data, {headers: this.getHeaders()}));
        }catch(e) {
            return {
                ok: false,
                status: e.response.status,
                data: e.response.data
            };
        }
    }
    private async requestForDelete<T>(url: string): Promise<CommonResult<T>> {
        try {
            return result(await axios.delete(this.config.SERVER_URL + url, {headers: this.getHeaders()}));
        }catch(e) {
            return {
                ok: false,
                status: e.response.status,
                data: e.response.data
            };
        }
    }
}

export interface CoreRequest {
    getURL(url: string): string
    requestForGet<T>(url: string, params?: any): Promise<CommonResult<T>>
    requestForPost<T>(url: string, data?: any): Promise<CommonResult<T>>
    requestForPut<T>(url: string, data?: any): Promise<CommonResult<T>>
    requestForDelete<T>(url: string): Promise<CommonResult<T>>
}

export class CoreModule {
    core: CoreRequest|null = null;
}

interface TokenCreateReq {
    username: string
    password: string
    effective: number|null,
    effective_unlimit: boolean
}

interface TokenUpdateReq {
    effective: number
}

interface TokenRetrieveRes {
    key: string
    username: string
    expire_time: string
    create_time: string
    update_time: string
}

export interface LoginReq {
    username: string
    password: string
}

export interface RegisterReq {
    username: string
    name: string
    password: string
    code: string|null
}

export const TOKEN_CREATE_CODE = {
    PASSWORD_WRONG: 'Password wrong',
    USER_NOT_EXIST: 'User not exist',
    USER_NOT_ENABLED: 'User not enabled'
};
export const REGISTER_CODE = {
    DISABLED_REGISTRATION_CODE: 'Disabled registration code',
    NEED_REGISTRATION_CODE: 'Need registration code',
    USERNAME_EXIST: 'Username exist',
    REGISTER_CLOSED: 'Register closed'
}

export const TOKEN_CREATE_REV = reverse(TOKEN_CREATE_CODE);
export const REGISTER_REV = reverse(REGISTER_CODE);

const core = new Core();

export default core;