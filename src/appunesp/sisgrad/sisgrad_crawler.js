import {Cookies} from '/simple_crawler/cookies.js'
import {Crawler} from '/simple_crawler/crawler.js'

const sisgrad_domain = `sistemas.unesp.br`;

const build_url = (path) => `https://` + sisgrad_domain + path;

const paths = {
    login_form:   build_url('/sentinela'), //login form
    login_action: build_url('/sentinela/login.open.action') //login form posts to this url
}

export class SisgradCrawler {
    cookie_stores = [];

    constructor(user_agent=false) {
        this.user_agent = user_agent;
        this.cookie_stores.push(CookieStore(sisgrad_domain));
    }

    load_login_page = (previous_page=false) => {
        return html_crawl(paths.login_form, 
                          user_agent=this.user_agent, 
                          cookie_stores=this.cookie_stores);
    }

    perform_login = (username, password, previous_page=false) => {
        post = "username=" + username + "&" + "password=" + password;

        return html_crawl(paths.login_action, 
                          user_agent=this.user_agent,
                          post_data=post, 
                          cookie_stores=this.cookie_stores);
    }
}