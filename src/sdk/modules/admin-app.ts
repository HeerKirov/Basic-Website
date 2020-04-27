import { CoreModule, trans } from '../core';
import { CommonResult } from '../modal';

class AdminApp extends CoreModule {
    async getAppList(): Promise<CommonResult<AppInfoRes[]>> {
        return trans(await this.core!.requestForGet<AppInfoRetrieveRes[]>('/api/admin/app/'), r => r.map(transAppInfo));
    }
    async createApp(req: AppCreateReq): Promise<CommonResult<AppInfoRes>> {
        return trans(await this.core!.requestForPost<AppInfoRetrieveRes>(`/api/admin/app/`, {
            app_id: req.appId,
            name: req.name,
            description: req.description,
            url: req.url,
            public: req.public
        }), transAppInfo);
    }
    async getAppDetail(appId: string): Promise<CommonResult<AppInfoRes>> {
        return trans(await this.core!.requestForGet<AppInfoRetrieveRes>(`/api/admin/app/${encodeURIComponent(appId)}/`), transAppInfo);
    }
    async updateApp(appId: string, req: AppUpdateReq): Promise<CommonResult<AppInfoRes>> {
        return trans(await this.core!.requestForPut<AppInfoRetrieveRes>(`/api/admin/app/${decodeURIComponent(appId)}/`, req), transAppInfo);
    }
    async deleteApp(appId: string): Promise<CommonResult<null>> {
        return await this.core!.requestForDelete(`/api/admin/app/${encodeURIComponent(appId)}/`);
    }
    async getAppSecret(appId: string): Promise<CommonResult<AppSecretRes>> {
        return await this.core!.requestForGet<AppSecretRes>(`/api/admin/app/${encodeURIComponent(appId)}/secret/`);
    }
    async updateAppSecret(appId: string): Promise<CommonResult<AppSecretRes>> {
        return await this.core!.requestForPut<AppSecretRes>(`/api/admin/app/${encodeURIComponent(appId)}/secret/`);
    }
}

function transAppInfo(r: AppInfoRetrieveRes): AppInfoRes {
    return {
        appId: r.app_id,
        name: r.name,
        description: r.description,
        url: r.url,
        public: r.public,
        enable: r.enable,
        createTime: new Date(r.create_time),
        updateTime: new Date(r.update_time)
    }
}

interface AppInfoRetrieveRes {
    app_id: string
    name: string
    description: string
    url: {[t: string]: string}
    public: boolean
    enable: boolean
    create_time: string
    update_time: string
}

export interface AppInfoRes {
    appId: string
    name: string
    description: string
    url: {[t: string]: string}
    public: boolean
    enable: boolean
    createTime: Date
    updateTime: Date
}

export interface AppSecretRes {
    secret: string
}

export interface AppBaseReq {
    name: string
    description: string
    url: {[t: string]: string}
    public: boolean
}

export interface AppUpdateReq extends AppBaseReq {
    enable: boolean
}

export interface AppCreateReq extends AppBaseReq {
    appId: string
}

export default new AdminApp();;