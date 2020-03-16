export type Dict<T> = {[t: string]: T};

export class Format {
    static toDateTimeString(d?: Date): string {
        if(d) {
            return `${d.getFullYear()}-${Format.to2num(d.getMonth() + 1)}-${Format.to2num(d.getDate())} ${Format.to2num(d.getHours())}:${Format.to2num(d.getMinutes())}`
        }else{
            return '';
        }
    }

    private static to2num(n: number): string {
        return n >= 10 ? (n + '') : '0' + n;
    }
}