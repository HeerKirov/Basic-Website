import { CoreModule, trans } from '../core';
import { CommonResult } from '../modal';

class UserApp extends CoreModule {
    async getAppList(): Promise<CommonResult<AppInfoRes[]>> {
        return trans(await this.core!.requestForGet<AppInfoRetrieveRes[]>('/api/app/'), r => r.map(transAppInfo));
    }
    async getAppDetail(appId: string): Promise<CommonResult<AppInfoRes>> {
        return trans(await this.core!.requestForGet<AppInfoRetrieveRes>(`/api/app/${encodeURIComponent(appId)}/`), transAppInfo);
    }
    async getUsingAppList(): Promise<CommonResult<UseInfoRes[]>> {
        return trans(await this.core!.requestForGet<UseInfoRetrieveRes[]>('/api/app-use/'), r => r.map(transUseInfo));
    }
    async getUsingAppDetail(appId: string): Promise<CommonResult<UseInfoRes>> {
        return trans(await this.core!.requestForGet<UseInfoRetrieveRes>(`/api/app-use/${encodeURIComponent(appId)}/`), transUseInfo);
    }
}

function transAppInfo(r: AppInfoRetrieveRes): AppInfoRes {
    return {
        appId: r.app_id,
        name: r.name,
        description: r.description,
        url: r.url,
        createTime: new Date(r.create_time),
        updateTime: new Date(r.update_time)
    }
}

function transUseInfo(r: UseInfoRetrieveRes): UseInfoRes {
    return {
        app: transAppInfo(r.app),
        publicApp: r.public_app,
        lastUse: r.last_use != null ? new Date(r.last_use) : null,
        createTime: new Date(r.create_time)
    }
}

interface AppInfoRetrieveRes {
    app_id: string
    name: string
    description: string
    url: {[t: string]: string}
    create_time: string
    update_time: string
}

interface UseInfoRetrieveRes {
    public_app: boolean
    last_use: string|null
    create_time: string
    app: AppInfoRetrieveRes
}

export interface AppInfoRes {
    appId: string
    name: string
    description: string
    url: {[t: string]: string}
    createTime: Date
    updateTime: Date
}

export interface UseInfoRes {
    publicApp: boolean
    lastUse: Date|null
    createTime: Date
    app: AppInfoRes
}

export default new UserApp();