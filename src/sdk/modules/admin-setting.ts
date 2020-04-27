import { CoreModule, trans } from '../core';
import { CommonResult } from '../modal';

class AdminSetting extends CoreModule {
    async get(): Promise<CommonResult<Setting>> {
        return trans(await this.core!.requestForGet<SettingRetrieve>('/api/admin/setting/'), transSetting)
    }
    async update(req: Setting): Promise<CommonResult<Setting>> {
        return trans(await this.core!.requestForPost<SettingRetrieve>('/api/admin/setting/', {
            register_mode: req.registerMode,
            effective_default: req.effectiveDefault,
            effective_max: req.effectiveMax
        }), transSetting);
    }
}

function transSetting(r: SettingRetrieve): Setting {
    return {
        registerMode: r.register_mode,
        effectiveDefault: r.effective_default,
        effectiveMax: r.effective_max
    };
}

interface SettingRetrieve {
    register_mode: "Open"|"Close"|"Code"
    effective_max: number|null
    effective_default: number
}

export interface Setting {
    registerMode: "Open"|"Close"|"Code"
    effectiveMax: number|null
    effectiveDefault: number
}

export default new AdminSetting();