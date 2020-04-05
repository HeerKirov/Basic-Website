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
        app_id: r.app_id,
        name: r.name,
        description: r.description,
        url: r.url,
        create_time: new Date(r.create_time),
        update_time: new Date(r.update_time)
    }
}

function transUseInfo(r: UseInfoRetrieveRes): UseInfoRes {
    return {
        app: transAppInfo(r.app),
        public_app: r.public_app,
        last_use: r.last_use != null ? new Date(r.last_use) : null,
        create_time: new Date(r.create_time)
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
    app_id: string
    name: string
    description: string
    url: {[t: string]: string}
    create_time: Date
    update_time: Date
}

export interface UseInfoRes {
    public_app: boolean
    last_use: Date|null
    create_time: Date
    app: AppInfoRes
}

const userApp = new UserApp();

export default userApp;