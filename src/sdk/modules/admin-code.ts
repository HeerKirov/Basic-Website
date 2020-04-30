import { CoreModule, trans } from '../core';
import { CommonResult } from '../modal';

class AdminCode extends CoreModule {
    async getCodeList(): Promise<CommonResult<CodeRes[]>> {
        return trans(await this.core!.requestForGet<CodeRetrieveRes[]>('/api/admin/registration-code/'), r => r.map(transCode));
    }
    async getCodeDetail(id: number): Promise<CommonResult<CodeRes>> {
        return trans(await this.core!.requestForGet<CodeRetrieveRes>(`/api/admin/registration-code/${id}/`), transCode);
    }
    async createCode(deadline?: Date|null): Promise<CommonResult<CodeRes>> {
        return trans(await this.core!.requestForPost<CodeRetrieveRes>(`/api/admin/registration-code/`, {
            deadline: deadline ? deadline.toISOString() : undefined
        }), transCode);
    }
    async updateCode(id: number, req: UpdateCodeReq): Promise<CommonResult<CodeRes>> {
        return trans(await this.core!.requestForPut<CodeRetrieveRes>(`/api/admin/registration-code/${id}/`, {
            deadline: req.deadline ? req.deadline.toISOString() : undefined,
            enable: req.enable
        }), transCode);
    }
}

function transCode(r: CodeRetrieveRes): CodeRes {
    return {
        id: r.id,
        code: r.code,
        enable: r.enable,
        deadline: r.deadline ? new Date(r.deadline) : null,
        usedTime: r.used_time ? new Date(r.used_time) : null,
        usedUser: r.used_user,
        createTime: new Date(r.create_time)
    };
}

interface CodeRetrieveRes {
    id: number
    code: string
    enable: boolean
    deadline: string|null
    used_time: string|null
    used_user: string|null
    create_time: string
}

export interface CodeRes {
    id: number
    code: string
    enable: boolean
    deadline: Date|null
    usedTime: Date|null
    usedUser: string|null
    createTime: Date
}

export interface UpdateCodeReq {
    deadline: Date|null
    enable: boolean|null
}

export default new AdminCode();