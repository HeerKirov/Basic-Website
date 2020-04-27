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
        return await this.core!.requestForPost<null>('/api/user/password/', {
            old_password: req.oldPassword,
            new_password: req.newPassword
        });
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
        isStaff: r.is_staff,
        lastLogin: r.last_login ? new Date(r.last_login) : null,
        lastLoginIp: r.last_login_ip,
        createTime: new Date(r.create_time),
        updateTime: new Date(r.update_time)
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
    isStaff: boolean
    lastLogin: Date|null
    lastLoginIp: string|null
    createTime: Date
    updateTime: Date
}

export interface UpdateUserInfoReq {
    name: string
}

export interface UpdatePasswordReq {
    oldPassword: string
    newPassword: string
}

export default new UserInfo();