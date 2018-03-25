import {Cookies} from 'cookies.js'

//Will only update if the given cookieStore matches the domain of the given header
update_cookies = function(header, cookieStore) {
    //do some regex here to get cookies
    for (cookie in cookies) {
        //break cookie in key and value here
        cookieStore.update(key, value);
    }
}

export async function html_crawl(page, post_data=false, content_type=false, agent=false) {
    const response = fetch(page,
    {
        body: post_data, // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'user-agent': agent ? agent : 'Mozilla/4.0 MDN Example'
          //'content-type': content_type ? content_type: 'text'
        },
        method: post_data ? 'POST' : 'GET', // *GET, POST, PUT, DELETE, etc.
        redirect: 'follow', // *manual, follow, error
        referrer: 'no-referrer', // *client, no-referrer
    });  // fetch page 

    const htmlString = await response.text(); // get response text
    return cheerio.load(htmlString);
}