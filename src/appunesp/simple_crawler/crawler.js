import { CookieStore, locateCookiesInHeader } from "./cookies";
const cheerio = require("cheerio-without-node-native");
//const cheerio = require("cheerio");

export async function crawl(url, 
                            post_data    = false, 
                            content_type = false, 
                            agent        = false,
                            cookieStores = false,
                            redirect     = true  ) {
    headers = {};
    headers['Agent'] = agent ?  agent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';
    headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    headers['Accept-Encoding'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    content_type ? headers['content-type'] = content_type: null;

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
            referrer      : 'no-referrer', // *client, no-referrer,
            keepalive     : true
        }
    );

    const http   = await response;
    const header = http.headers;
    const html   = await http.text();

    cookieStores ? update_cookies(header, cookieStores): null;
    return {
            header     : header, 
            redirected : http.redirected,
            status     : http.status,
            statusText : http.statusText,
            url        : http.url,
            useFinalURL: http.useFinalURL,
            $          : cheerio.load(html)
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