import { CookieStore } from '../simple_crawler/cookies.js'
import { crawl }       from '../simple_crawler/crawler.js'

const sisgradDomain = `sistemas.unesp.br`;
//sisgrad_domain = `google.com`;

const cheerioTableparser = require('cheerio-tableparser');

const build_url = (path) => `https://` + sisgradDomain + path;

const paths = {
    login_form            : build_url('/sentinela'),                   //login form
    login_form_redirected : build_url('/sentinela/login.open.action'), //login form posts to this url
    login_action          : build_url('/sentinela/login.action'),      //actual login
    read_messages_action  : build_url('/sentinela/common.openMessage.action?emailTipo=recebidas')
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

    performLogin = async function(username, password) {
        console.log('loading login page...');
        c = await this.crawl(paths.login_form);
        console.log(c.url)
        //If we ended in the actual login page, it contains an HTML
        //(not HTTP) redirect to the next page. Let's go to it.
        if (/\/sentinela/.test(c.url) && !/\/sentinela\/.+/.test(c.url)) {
            console.log('redirecting manually to ' + paths.login_form_redirected + '...');
            c = await this.crawl(decide(undefined, paths.login_form_redirected));
        }
        console.log(c.url)
        //If we're in the login.open.action, we should find a form there
        //so we fill this form an then send it
        if (/\/sentinela\/login.open.action/.test(c.url)) {
            console.log('doing login to ' + paths.login_action + '...');
            c = await this.crawl(decide(undefined, paths.login_action));
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
            c = await this.crawl(decide(undefined, paths.login_action), postData = post);
            console.log('url now: ' + c.url);
            //console.log(c.$.text());
        }
        if (/\/sentinela\/sentinela.showDesktop.action/.test(c.url)) {
            //console.log(c.$.text());
            //console.log(c.$.html());

            return true;
        }
        //TODO: If c contains login success, return true. Otherwise return false
        return false;
    }

    readMessages = async function(page = 0) {
        c = await this.crawl(decide(undefined, paths.read_messages_action));
        
        if (/\/sentinela\/common.openMessage.action\?emailTipo=recebidas/.test(c.url)) {
            $ = c.$;
            cheerioTableparser($);
            table = $('#destinatario').parsetable(false, false, true);
            data = [];
            //console.log(table[0][1]);
            clean = (string) => string.replace(/ /g,'');
            for (var i in table[0]) {
                if (i != 0) {
                    data.push({
                        favorite       : clean(table[0][i]),
                        hasAttachment  : clean(table[1][i]),
                        sentBy         : clean(table[2][i]),
                        subject        : clean(table[3][i]),
                        sentDate       : clean(table[4][i]),
                        readDate       : clean(table[5][i])
                    })
                }
            }
            //console.log(data);
            //console.log(table.html());
        }
        return data;
    }
}