export class CookieStore {
    keys = {};

    constructor(domain) {
        this.domain = domain;
    }

    update = (key, value) => {
        keys[key] = value;
    }
}