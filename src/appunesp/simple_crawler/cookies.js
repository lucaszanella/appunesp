export class CookieStore {
    keys = {};

    static locateInHeader(header) {
        
        return cookies;
    }

    constructor(domain) {
        this.domain = domain;
    }

    update = (key, value) => {
        keys[key] = value;
    }
}