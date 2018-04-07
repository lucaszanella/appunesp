import { CookieStore } from '../simple_crawler/cookies.js';
import { crawl, pathIsFromUrl } from '../simple_crawler/crawler.js';
import realm, {messagesTable} from '../realm';
import escapeRegExp from '../utils/escaperegexp';
const cheerio = require("cheerio-without-node-native");
const sisgradDomain = `sistemas.unesp.br`;
const md5 = require("blueimp-md5");

class build_url {
    constructor(path) {
        this.url  = `https://` + sisgradDomain + path;
        this.path = escapeRegExp(path);
    }
}

const paths = {
    login_form            : new build_url('/sentinela'),                   //login form
    login_form_redirected : new build_url('/sentinela/login.open.action'), //login form posts to this url
    login_action          : new build_url('/sentinela/login.action'),      //actual login
    show_desktop_action   : new build_url('/sentinela/sentinela.showDesktop.action'),
    read_messages_action  : page => new build_url('/sentinela/common.openMessage.action?emailTipo=recebidas'),
    read_message_action   : id   => new build_url(`/sentinela/common.viewMessage.action?txt_id=${id}&emailTipo=recebidas`),
}

//decide = (url, alternative) => url = url ? url : alternative; //No URL suggestion? Use the alternative

clean  = string => string.replace(/[ \t\n]+/g,' ').trim(); //removes extra whitespace

export class SisgradCrawler {

    constructor(username, password, userAgent=false) {
        this.userAgent = userAgent;
        this.username  = username;
        this.password  = password;
        /*
        this.crawl = (args) => {
            console.log('crawling');
            console.log(arguments);
            return crawl(userAgent = this.userAgent, args)
        }
        */
        this.crawl = this.redoLoginIfNecessary;
    }

    //Used some messy hacks to deal with named arguments and avoid repetition of this huge parameters list
    redoLoginIfNecessary = async function(path = undefined,
                                          options) { //If for some reason we got unlogged
        response = () => crawl(path, 
                               {
                                postData     : options.postData, 
                                contentType  : options.contentType, 
                                userAgent    : options.userAgent ? options.userAgent : this.userAgent,
                                redirect     : options.redirect,
                                expectUrl    : options.expectUrl,
                                expectThrow  : options.expectThrow
                               })
        r = await response();

        if (options.redirectLogin && pathIsFromUrl(paths.login_form.path, r.url)) {
            console.log('hmmm, logged out, doing login again');
            this.performLogin();
            r = await response();
            return r;
        } else {
            return r;
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
        console.log('loading login page: ' + paths.login_form.url);

        r = await this.crawl(paths.login_form.url,
                            {
                             expectUrl     : paths.login_form.path,
                             redirectLogin : false
                            });
        console.log(r.url)
        r = await this.crawl(paths.login_form_redirected.url,
                            { 
                             expectUrl     : paths.login_form_redirected.path,
                             redirectLogin : false
                            }); //If we ended in the actual login page, it contains an HTML (not HTTP) redirect to the next page. Let's go to it.
        console.log(r.url)

        console.log('doing login ...');

        r = await this.crawl(paths.login_action.url,
                            { 
                             expectUrl     : paths.login_action.path,
                             redirectLogin : false
                            });
        console.log(r.url)

        $ = r.$;
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
                 { name: 'txt_senha'  , value: '' }]
        
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

        post = encodeURI(serialized);

        console.log('sending login info NOW')

        r = await this.crawl(paths.login_action.url,
                            { 
                             postData      : post, 
                             expectUrl     : paths.login_form_redirected.path,
                             redirectLogin : false
                            });
        return true;

        //TODO: If r contains login success, return true. Otherwise return false
    }

    readMessages = async function(page = 0) {
        console.log('reading messages...')
        r = await this.crawl(paths.read_messages_action(page).url,
                            {expectUrl : paths.read_messages_action(page).path});
        
        $ = r.$;
        table = $('#destinatario').parsetable(false, false, false);
        data = [];

        for (var i in table[0]) {
            if (i != 0) {
                doc = {
                    favorite       : clean($(table[0][i]).text()),
                    hasAttachment  : clean($(table[1][i]).text()),
                    sentBy         : clean(table[2][i])          ,
                    subject        : clean($(table[3][i]).text()),
                    sentDate       : clean(table[4][i])          ,
                    readDate       : clean(table[5][i])          ,
                    sisgradId      : /VisualizarMensagem\('(\d+)'\)/.exec($('a', table[3][i]).attr('href'))[1]                ,
                }
                data.push(doc)
            }
        }
        console.log(data);
        data.map(this.recordMessage); //TODO: slow down recording, too many in async mode
        
        return data;
    }

    readMessage = async function(id) {
        r = await this.crawl(paths.read_message_action(id),
                            {expectUrl : paths.read_message_action(id).path});
        $ = r.$;
        form        = $('form[name=form_email]');
        table       = $('table', form).first().parsetable(false, false, false);
        message     = clean($(table[0][5]).text());
        attachments = table[1][4];
        attachments = $('a', attachments).toArray();
        attachments = attachments.map(x => $(x));
        attachments = attachments.map(x => (
                {
                link : x.attr('href'), 
                title: clean(x.text())
                }
        ));
        sender   = table[1][1];
        subject  = table[1][2];
        sentDate = table[1][3];

        return {
            id         : id,
            sender     : sender,
            subject    : subject,
            message    : message,
            attachments: attachments,
            sentDate   : sentDate   
        }
    }
 
    recordMessage = async function (message) {
        id = md5(message.sisgradId);
        doc =  {
                    id             : id                   ,
                    favorite       : message.favorite     ,
                    hasAttachment  : message.hasAttachment,
                    sentBy         : message.sentBy       ,
                    subject        : message.subject      ,
                    sentDate       : message.sentDate     ,
                    readDate       : message.readDate     ,
                    sisgradId      : message.sisgradId    ,
                    message        : ''                   ,
                }

        if (realm.objects(messagesTable).filtered(`id = "${id}"`).length==0){
            realm.write(() => realm.create(messagesTable, doc))
            console.log('recording message ' + message + " at " + messagesTable);
        }
    }

    updateMessages = async function() {
        record  = (message, id) => () => {
            message.id = id;
            message.message = message;          
        }

        while (emptyMessages = realm.objects(messagesTable).filtered('message = ""').slice(0,5)) {
            queue = [];

            for (emptyMessage of emptyMessages) {
                console.log('going to read message ' + emptyMessage.sisgradId);
                m = this.readMessage(emptyMessage.sisgradId);
                queue.push(m);
            }

            for (message of queue) {
                await message;
                console.log(message.message);
                console.log(message.id);
                console.log(message);
                realm.write(record(message, message.id));
            }
        }
    }
}