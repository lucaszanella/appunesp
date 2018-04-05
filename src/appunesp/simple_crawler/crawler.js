import { CookieStore, locateCookiesInHeader } from "./cookies";
import escapeRegExp from '../utils/escaperegexp';
const cheerio = require("cheerio-without-node-native");
const cheerioTableparser = require('cheerio-tableparser');

export const pathIsFromUrl = (path, url) => RegExp(path + '\/?$').test(url); //Tests if path is in URL up to the last character, possibly ending with /

//const cheerio = require("cheerio");
    
// fetch logger
global._fetch = fetch;
global.fetch = function (uri, options, ...args) {
    return global._fetch(uri, options, ...args).then((response) => {
    console.log('Fetch', { request: { uri, options, ...args }, response });
    return response;
    });
};
    
export async function crawl(path         = undefined, 
                            postData     = false    , 
                            contentType  = false    , 
                            userAgent    = false    ,
                            cookieStores = false    ,
                            redirect     = true     ,
                            expectUrl    = undefined,
                            expectThrow  = true) {
    headers = {};
    headers['Agent'] = userAgent ?  userAgent : 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0';
    headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
    //headers['Accept-Encoding'] = 'gzip, deflate, br';
    //headers['Content-Type'] = 'application/json;charset=utf-8';
    headers['Content-type'] = contentType ? contentType : 'application/x-www-form-urlencoded';
    //if (cookieStores) 
    //    for (cookieStore of cookieStores) 
    //        url.includes(cookieStore.domain) ? headers['Cookies'] = cookieStore.getEncoded() : console.log('nothing');
        
    const response = fetch(
        path,
        {
            body          : postData ? postData : undefined, // must match 'Content-Type' header
            headers       : headers,
            method        : postData ? 'POST' : 'GET', // *GET, POST, PUT, DELETE, etc.
            //redirect      : true,//redirect ? 'follow' : 'manual', // *manual, follow, error. TODO: is manual the right keyword?
            referrer      : 'no-referrer', // *client, no-referrer,
            keepalive     : true,
            //credentials   : 'include',
            //mode          : 'cors'
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // *manual, follow, error
            referrer: 'no-referrer', // *client, no-referrer
        }
    );

    const http       = await response;
    const header     = http.headers;
    const html       = await http.text();
    const parsedHtml = cheerio.load(html, { decodeEntities: false });
    cheerioTableparser(parsedHtml); //Inclused table parser method in cheerio
    console.log({'html': html});
    if (expectThrow && expectUrl)
        pathIsFromUrl(expectUrl, http.url) ? console.log("THROW") : null
    //cookieStores ? updateCookies(http.url, header, cookieStores): undefined;
    return {
                header     : header, 
                redirected : http.redirected,
                status     : http.status,
                statusText : http.statusText,
                url        : http.url,
                useFinalURL: http.useFinalURL,
                $          : parsedHtml,
                expect     : expectUrl ? pathIsFromUrl(expectUrl, http.url) : undefined,
           };
}

//Will only update if the given cookieStore matches the domain of the given header
//Does not support cookies from domain to subdomains yet
/*
updateCookies = function(url, header, cookieStores) {
    for (cookieStore of cookieStores) {
        console.log('updating cookies')
        console.log(url)
        console.log(url.includes(cookieStore.domain))
        console.log(header)
        if (url.includes(cookieStore.domain)) {
            console.log('is equal')
            for (cookie of locateCookiesInHeader(header)) {
                console.log('updating ' + cookie.key + ":" + cookie.value)
                cookieStore.update(cookie.key, cookie.value);
            }
        }
    }
}
*/