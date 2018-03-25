import { CookieStore, locateCookiesInHeader } from "./cookies";
const cheerio = require("cheerio-without-node-native");

export async function crawl(url, 
                            post_data    = false, 
                            content_type = false, 
                            agent        = false,
                            cookieStores = false,
                            redirect     = true  ) {
    headers['agent'] = agent ?  agent: 'mozilla...';
    content_type ? headers['content-type'] = 'text': null;

    if (cookieStores)
        cookieStores.domain.includes(url) ? headers['cookies'] = cookieStores.getEncoded() : null;
    
    const response = fetch(
        url,
        {
            body          : post_data ? post_data : undefined, // must match 'Content-Type' header
            cache         : 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers       : headers,
            method        : post_data ? 'POST' : 'GET', // *GET, POST, PUT, DELETE, etc.
            redirect      : redirect ? 'follow' : 'manual', // *manual, follow, error. TODO: is manual the right keyword?
            referrer      : 'no-referrer', // *client, no-referrer
        }
    );

    const http   = await response;
    const header = http.headers;
    const html   = http.text();

    cookieStores ? update_cookies(header, cookieStores): null;
    return {
            header: header, 
            body  : cheerio.load(html)
           };
}

//Will only update if the given cookieStore matches the domain of the given header
//Does not support cookies from domain to subdomains yet
update_cookies = function(header, cookieStores) {
    for (cookieStore of cookieStores) {
        if (header.domain == cookieStore.domain) {
            for (cookie of locateCookiesInHeader(header)) {
                cookieStore.update(cookie.key, cookie.value);
            }
        }
    }
}