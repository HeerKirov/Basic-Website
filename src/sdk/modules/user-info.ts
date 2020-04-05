import { CoreModule, trans } from '../core';
import { CommonResult } from '../modal';

class UserInfo extends CoreModule {
    async getUserInfo(): Promise<CommonResult<UserInfoRes>> {
        return trans(await this.core!.requestForGet<UserInfoRetrieveRes>('/api/user/'), transUserInfo);
    }
    async updateUserInfo(req: UpdateUserInfoReq): Promise<CommonResult<UserInfoRes>> {
        return trans(await this.core!.requestForPost<UserInfoRetrieveRes>('/api/user/', req), transUserInfo);
    }
    async updateUserPassword(req: UpdatePasswordReq): Promise<CommonResult<null>> {
        return await this.core!.requestForPost<null>('/api/user/password/', req);
    }
    async uploadUserCover(file: File): Promise<CommonResult<null>> {
        let formData = new FormData();
        formData.set('file', file);
        return this.core!.requestForPost('/api/user/cover/', formData);
    }
    getCoverURL(coverFileName: string): string {
        return this.core!.getURL(`/static/cover/${coverFileName}`);
    }
}

function transUserInfo(r: UserInfoRetrieveRes): UserInfoRes {
    return {
        username: r.username,
        name: r.name,
        cover: r.cover,
        is_staff: r.is_staff,
        last_login: r.last_login ? new Date(r.last_login) : null,
        last_login_ip: r.last_login_ip,
        create_time: new Date(r.create_time),
        update_time: new Date(r.update_time)
    }
}

interface UserInfoRetrieveRes {
    username: string
    name: string
    cover: string|null
    is_staff: boolean
    last_login: string|null
    last_login_ip: string|null
    create_time: string
    update_time: string
}

export interface UserInfoRes {
    username: string
    name: string
    cover: string|null
    is_staff: boolean
    last_login: Date|null
    last_login_ip: string|null
    create_time: Date
    update_time: Date
}

export interface UpdateUserInfoReq {
    name: string
}

export interface UpdatePasswordReq {
    old_password: string
    new_password: string
}

const userInfo = new UserInfo();

export default userInfo;