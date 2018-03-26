import { CookieStore } from '../simple_crawler/cookies.js'
import { crawl }       from '../simple_crawler/crawler.js'

const sisgrad_domain = `sistemas.unesp.br`;
//sisgrad_domain = `google.com`;

//const cheerioTableparser = require('cheerio-tableparser');

const build_url = (path) => `https://` + sisgrad_domain + path;

const paths = {
    login_form            : build_url('/sentinela'),                   //login form
    login_form_redirected : build_url('/sentinela/login.open.action'), //login form posts to this url
    login_action          : build_url('/sentinela/login.action')       //actual login
}
//No URL suggestion? Use the alternative
decide = (url, alternative) => url = url ? url : alternative;

export class SisgradCrawler {
    cookie_stores = [new CookieStore(sisgrad_domain)];

    constructor(user_agent=false) {
        this.user_agent = user_agent;
        this.crawl = (path, 
                      user_agent    = false, 
                      post_data     = false,
                      cookie_stores = false) => {
            crawl(path, user_agent, post_data, cookie_stores)
        }
    }


    load_login_page = (previous_page=false) => {
        console.log('loading login page...');
        return crawl(paths.login_form);
    }

    //We know the URL login, but it can change, so let's prefer the suggested url
    perform_login_page = (url, previous_page=false) => {
        return crawl(decide(url, paths.login_form_redirected));
    }

    perform_login = (url=undefined, form_data=false, username=false, password=false, previous_page=false) => {
        if (form_data)
          post = form_data
        else
          post = encodeURIComponent("username=" + username + "&" + "password=" + password);
        return crawl(decide(url, paths.login_action), post_data = post);
    }
}