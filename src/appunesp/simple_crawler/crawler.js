import { CookieStore } from "./cookies";

//import {CookieStore} from 'cookies.js'
//import cheerio from '';

const cheerio = require("cheerio-without-node-native");

//Will only update if the given cookieStore matches the domain of the given header
update_cookies = function(header, cookieStores) {
    for (cookieStore of cookieStores) {
        if (header.domain == cookieStore.domain) {
            for (cookie of CookieStore.locateInHeader(header)) {
                cookieStore.update(cookie.key, cookie.value);
            }
        }
    }
}

export async function crawl(url, 
                            post_data=false, 
                            content_type=false, 
                            agent=false,
                            cookieStores=false,
                            redirect=true) {
    const response = fetch(
        url,
        {
            body: post_data ? post_data : undefined, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
            'user-agent': agent ? agent : 'Mozilla/4.0 MDN Example'
            //'content-type': content_type ? content_type: 'text'
            },
            method: post_data ? 'POST' : 'GET', // *GET, POST, PUT, DELETE, etc.
            redirect: redirect ? 'follow' : 'manual', // *manual, follow, error. TODO: is manual the right keyword?
            referrer: 'no-referrer', // *client, no-referrer
        }
    ); 

    const htmlString = await response.text();
    return cheerio.load(htmlString);
}