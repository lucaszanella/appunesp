import { CookieStore } from '../simple_crawler/cookies.js'
import { crawl }       from '../simple_crawler/crawler.js'
import realm, {messagesTable} from '../realm';
const cheerio            = require("cheerio-without-node-native");
const cheerioTableparser = require('cheerio-tableparser');
const sisgradDomain      = `sistemas.unesp.br`;
const build_url          = (path) => `https://` + sisgradDomain + path;
const md5                = require("blueimp-md5");


const paths = {
    login_form            : build_url('/sentinela'),                   //login form
    login_form_redirected : build_url('/sentinela/login.open.action'), //login form posts to this url
    login_action          : build_url('/sentinela/login.action'),      //actual login
    read_messages_action  : build_url('/sentinela/common.openMessage.action?emailTipo=recebidas'),
    read_message_action   : (id) => build_url('/sentinela/common.openMessage.action?emailTipo=recebidas'),
}

//No URL suggestion? Use the alternative
decide = (url, alternative) => url = url ? url : alternative;
clean = string => string.replace(/[ \t\n]+/g,' ').trim();//removes extra whitespace

export class SisgradCrawler {
    //cookieStores = [new CookieStore(sisgradDomain)];

    constructor(username, password, userAgent=false) {
        this.userAgent = userAgent;
        this.username  = username;
        this.password  = password;

        this.crawl = (path,
                      postData      = false,
                      contentType   = false,                         
                      userAgent     = false, 
                      cookieStores  = false,
                      redirect      = false) => {
            //If no cookie stores passed, use the default one
            //cookieStores = cookieStores ? false : this.cookieStores;

            return crawl(path,
                         postData     = postData, 
                         contentType  = contentType,                         
                         userAgent    = this.userAgent, 
                         cookieStores = cookieStores,
                         redirect     = redirect)
        }
    }

    messagesFromRealm = () => {
        try {  
            return realm.objects(messagesTable);
        } catch (error) {
            return [];
        }
    }

    performLogin = async function() {
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
            login = [{ name: 'txt_usuario', value: '' },
                     { name: 'txt_senha'  , value: '' } ]
            
            serialized = "";
          
            login.map(item => {
              if (item.name=='txt_usuario')
                item.value = this.username
              if (item.name=='txt_senha')
                item.value = this.password
              return item;
            }).   map(item => 
              serialized += "&" + item.name + "=" + item.value
            );
          
            serialized = serialized.substr(1, serialized.length); //removes first '&'
            //if (serialized)
                post = encodeURI(serialized);
            //else
                //post = encodeURIComponent("username=" + this.username + "&" + "password=" + this.password);
            console.log('encoded uri: ' + post + '. Sending login NOW:');
            c = await this.crawl(decide(undefined, paths.login_action), postData = post);
            console.log('url now: ' + c.url);
            //console.log(c.$.html())
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
        console.log('reading messages...')
        c = await this.crawl(decide(undefined, paths.read_messages_action));
        if (/\/sentinela\/login.open.action/.test(c.url)) {
            this.performLogin(); 
            c = await this.crawl(decide(undefined, paths.read_messages_action));
        }

        if (/\/sentinela\/common.openMessage.action\?emailTipo=recebidas/.test(c.url)) {
            $ = c.$;
            cheerioTableparser($);
            table = $('#destinatario').parsetable(false, false, false);
            data = [];
            //console.log('ué');
            //console.log(table[2][3]);
            //console.log($(table[2][3]).text())
            for (var i in table[0]) {
                if (i != 0) {
                    doc = {
                        favorite       : clean($(table[0][i]).text()),
                        hasAttachment  : clean($(table[1][i]).text()),
                        sentBy         : clean(table[2][i]),
                        subject        : clean($(table[3][i]).text()),
                        sentDate       : clean(table[4][i])          ,
                        readDate       : clean(table[5][i])          ,
                        sisgradId      : /VisualizarMensagem\('(\d+)'\)/.exec($('a', table[3][i]).attr('href'))[1]                ,
                    }
                    data.push(doc)
                }
            }
            console.log(data);
            console.log('going to record the messages');
            data.map(this.recordMessage);
        }
        return data;
    }

    readMessage = async function(id) {
        c = await this.crawl(decide(undefined, paths.read_message_action(id)));
        
        if (/\/sentinela\/common.openMessage.action\?emailTipo=recebidas/.test(c.url)) {
            $ = c.$;
            cheerioTableparser($);
            table = $('#destinatario').parsetable(false, false, false);
            
        }
        return data;
    }
 
    recordMessage = message => {
        id = md5(message.sisgradId);
        doc =  {id             : id                   ,
                favorite       : message.favorite     ,
                hasAttachment  : message.hasAttachment,
                sentBy         : message.sentBy       ,
                subject        : message.subject      ,
                sentDate       : message.sentDate     ,
                readDate       : message.readDate     ,
                sisgradId      : message.sisgradId    ,
                message        : ''                   ,}
        if (realm.objects(messagesTable).filtered('id = "' + id + '"').length==0){
            realm.write(() => realm.create(messagesTable, doc))
            console.log('recording message ' + message + "at " + messagesTable);
            console.log(message);
        }
    }

    updateMessages = async function() {
        record  = (message, id) => () => {
            id = md5(message.sisgradId + message.subject)
            doc =   {
                        id             : id,
                        message        : '',
                    }
            realm.create(messagesTable, doc)            
        }

        emptyMessages = realm.objects(messagesTable).filtered('message = ""')
        for (emptyMessage of emptyMessages) {
            message = await this.readMessage(emptyMessage.sisgradId);
            realm.write(record(message, emptyMessage.id))
        }
    }
}