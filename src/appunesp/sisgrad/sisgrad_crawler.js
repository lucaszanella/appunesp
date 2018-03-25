import { CookieStore } from '../simple_crawler/cookies.js'
import { crawl }       from '../simple_crawler/crawler.js'

const sisgrad_domain = `sistemas.unesp.br`;
//sisgrad_domain = `google.com`;

const build_url = (path) => `https://` + sisgrad_domain + path;

const paths = {
    login_form  : build_url('/sentinela'),                  //login form
    login_action: build_url('/sentinela/login.open.action') //login form posts to this url
}

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

    perform_login = (username, password, previous_page=false) => {
        post = encodeURIComponent("username=" + username + "&" + "password=" + password);
        return crawl(paths.login_action, post_data = post);
    }
}