export function reverse(a: {[t: string]: string}): {[t: string]: string} {
    let ret: {[t: string]: string} = {};
    for(let k in a) {
        ret[a[k]] = k;
    }
    return ret;
}