import { CookieStore } from '../simple_crawler/cookies.js'
import { crawl }       from '../simple_crawler/crawler.js'

const sisgradDomain = `sistemas.unesp.br`;
//sisgrad_domain = `google.com`;

//const cheerioTableparser = require('cheerio-tableparser');

const build_url = (path) => `https://` + sisgradDomain + path;

const paths = {
    login_form            : build_url('/sentinela'),                   //login form
    login_form_redirected : build_url('/sentinela/login.open.action'), //login form posts to this url
    login_action          : build_url('/sentinela/login.action')       //actual login
}
//No URL suggestion? Use the alternative
decide = (url, alternative) => url = url ? url : alternative;

export class SisgradCrawler {
    cookieStores = [new CookieStore(sisgradDomain)];

    constructor(userAgent=false) {
        this.userAgent = userAgent;

        this.crawl = (path,
                      postData      = false,
                      contentType   = false,                         
                      userAgent     = false, 
                      cookieStores  = false,
                      redirect      = false) => {
            //If no cookie stores passed, use the default one
            cookieStores = cookieStores ? false : this.cookieStores;

            return crawl(path,
                         postData     = postData, 
                         contentType  = contentType,                         
                         userAgent    = this.userAgent, 
                         cookieStores = cookieStores,
                         redirect     = redirect)
        }
    }

    load_login_page = (previous_page=false) => {
        console.log('loading login page...');
        return this.crawl(paths.login_form);
    }

    //We know the URL login, but it can change, so let's prefer the suggested url
    perform_login_page = (url, previous_page=false) => {
        return this.crawl(decide(url, paths.login_form_redirected));
    }

    perform_login = (url=undefined, form_data=false, username=false, password=false, previous_page=false) => {
        if (form_data)
          post = encodeURI(form_data)
        else
          post = encodeURIComponent("username=" + username + "&" + "password=" + password);
        return this.crawl(decide(url, paths.login_action), post_data = post);
    }
}