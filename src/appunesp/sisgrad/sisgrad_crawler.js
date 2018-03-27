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

    performLogin = (username, password) => {
        console.log('loading login page...');
        c = this.crawl(paths.login_form);
        //If we ended in the actual login page, it contains an HTML
        //(not HTTP) redirect to the next page. Let's go to it.
        if (/\/sentinela/.test(c.url) && !/\/sentinela\/.+/.test(c.url)) {
            console.log('redirecting manually to ' + paths.login_form_redirected + '...');
            c = this.crawl(decide(undefined, paths.login_form_redirected));
        }
        //If we're in the login.open.action, we should find a form there
        //so we fill this form an then send it
        if (/\/sentinela\/login.open.action/.test(c.url)) {
            console.log('doing login to ' + paths.login_action + '...');
            c = this.crawl(decide(undefined, paths.login_action));
            $ = c.$;
            forms = $('form');
            var login_form = null;
          
            if (forms.lenght == 0)
              console.log('no form found')
            else if (forms.length == 1)
              login_form = forms.first()
            else if (t = $('form[name=formLogin]').lenght)
              login_form = t
            
            login = login_form.serializeArray();
            
            /*
              Cheerio non-node version`s serializeArray doesn't work. 
              Small tweak before I fix things:
            */
            login = [ { name: 'txt_usuario', value: '' },
                     { name: 'txt_senha', value: '' } ]
            
            serialized = "";
          
            login.map(item => {
              if (item.name=='txt_usuario')
                item.value = username
              if (item.name=='txt_senha')
                item.value = password
              return item;
            }).   map(item => 
              serialized += "&" + item.name + "=" + item.value
            );
          
            serialized = serialized.substr(1, serialized.length); //removes first '&'
            //if (serialized)
                post = encodeURI(serialized);
            //else
                //post = encodeURIComponent("username=" + username + "&" + "password=" + password);
            console.log('encoded uri: ' + post + '. Sending login NOW:');
            c = this.crawl(decide(undefined, paths.login_action), postData = post);
            console.log('url now: ' + c.url);
            console.log(c.text());
        }
        //TODO: If c contains login success, return true. Otherwise return false
        return c;
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