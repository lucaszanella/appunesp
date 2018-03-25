export class CookieStore {
    map = new Map();

    constructor(domain) {
        this.domain = domain;
    }

    update = (key, value) => {
        this.map.set(key, value);
    }

    getEncoded = () => {
        const s = "";
        for (var [cookie, value] of this.map.entries()) {
            s += cookie + "=" + value + "; ";
        }
    }
}

export function locateCookiesInHeader(header) {
    const cookiesRegex = /Set-Cookie:\s*([^=]+)=([^\;]+);\s?/g;
    //var cookies = /^Set-Cookie: /.exec(header);
    cookies = cookiesRegex.exec(header);
    return cookies;
}