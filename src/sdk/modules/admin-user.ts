import { CoreModule, trans } from '../core';
import { CommonResult } from '../modal';

class AdminUser extends CoreModule {
    async getUserList(): Promise<CommonResult<UserInfoRes[]>> {
        return trans(await this.core!.requestForGet<UserInfoRetrieveRes[]>('/api/admin/user/'), r => r.map(transUserInfo));
    }
    async getUserInfo(username: string): Promise<CommonResult<UserInfoRes>> {
        return trans(await this.core!.requestForGet<UserInfoRetrieveRes>(`/api/admin/user/${username}/`), transUserInfo);
    }
    async createUser(req: CreateUserInfoReq): Promise<CommonResult<UserInfoRes>> {
        return trans(await this.core!.requestForPost<UserInfoRetrieveRes>(`/api/admin/user/`, {
            username: req.username,
            password: req.password,
            name: req.name,
            is_staff: req.isStaff
        }), transUserInfo);
    }
    async updateUserStatus(username: string, enable: boolean): Promise<CommonResult<UserInfoRes>> {
        return trans(await this.core!.requestForPut<UserInfoRetrieveRes>(`/api/admin/user/${username}/`, {enable}), transUserInfo);
    }
    async updateUserPassword(username: string, password: string): Promise<CommonResult<UserInfoRes>> {
        return trans(await this.core!.requestForPut<UserInfoRetrieveRes>(`/api/admin/user/${username}/password/`, {new_password: password}), transUserInfo);
    }
    async deleteUser(username: string): Promise<CommonResult<null>> {
        return await this.core!.requestForDelete(`/api/admin/user/${username}/`);
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
        createPath: r.create_path,
        enable: r.enable
    };
}

type CreatePath = 'System'|'Admin'|'Code'|'Public';

interface UserInfoRetrieveRes {
    username: string
    name: string
    cover: string|null
    is_staff: boolean
    last_login: string|null
    last_login_ip: string|null
    create_time: string
    create_path: CreatePath
    enable: boolean
}

export interface UserInfoRes {
    username: string
    name: string
    cover: string|null
    isStaff: boolean
    lastLogin: Date|null
    lastLoginIp: string|null
    createTime: Date
    createPath: CreatePath
    enable: boolean
}

export interface CreateUserInfoReq {
    username: string
    password: string
    name: string
    isStaff: boolean
}

export default new AdminUser();