const domain = `sistemas.unesp.br`;

const paths = {
    login_form: '/sentinela',
    login_action: '/sentinela/login.open.action'
}

const access = (path) => `https://` + domain + path;

class SisgradCrawler {
    cookies = [];

    constructor(user_agent=false) {
        this.user_agent = user_agent;
    }

    load_login_page = () => {
        return html_crawl(paths.login_form, user_agent=this.user_agent);
    }

    perform_login = (username, password, previous_page=false) => {
        post = "username=" + username + "&" + "password=" + password;
        return html_crawl(paths.login_action, user_agent=this.user_agent,
                          post_data="");
    }
}