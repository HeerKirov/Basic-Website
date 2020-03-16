import { Auth } from '../core';

class Storage {
    private prefix: string = ''

    setPrefix(prefix: string): Storage {
        this.prefix = prefix;
        return this;
    }

    private getPrefix(): string {
        return `${this.prefix}/basic-service/token`;
    }

    getLoginEvent(): ((auth?: Auth) => void) {
        return auth => {
            if(auth) {
                window.localStorage.setItem(this.getPrefix(), auth!.token);
            }else{
                window.localStorage.removeItem(this.getPrefix());
            }
        };
    }

    getLogoutEvent(): (() => void) {
        return () => window.localStorage.removeItem(this.getPrefix());
    }

    loadStorageToken(): string|null {
        return window.localStorage.getItem(this.getPrefix());
    }
}

const storage = new Storage();

export default storage;