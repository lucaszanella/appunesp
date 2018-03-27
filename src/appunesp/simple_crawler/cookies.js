export class CookieStore {
    map = new Map();

    constructor(domain) {
        this.domain = domain;
    }

    update = (key, value) => {
        this.map.set(key, value);
    }

    getEncoded = () => {
        var s = "";
        for (var [cookie, value] of this.map.entries()) {
            s += cookie + "=" + value + "; ";
        }
        return s;
    }
}

export function locateCookiesInHeader(header) {
    const cookiesRegex = /Set-Cookie:\s?([^=]+)=([^\n]+)/g;
    cookies = []
    while ((r = cookiesRegex.exec(header)) !== null) {
      cookies.push({key: r[1], value: r[2]});
    }
    return cookies;
}