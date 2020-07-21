import * as $ from 'jquery';
const jsCookie = require('js-cookie'); // Usage and Docs: https://www.npmjs.com/package/js-cookie

class CookiesComponent {

    private $componentSelector: JQuery;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.checkOrSetCookieOnLoad();
    }


    checkOrSetCookieOnLoad(): void {
        const _self = this;
        let cookieVal: string = jsCookie.get('bhf-policy-update');

        if (typeof cookieVal === 'undefined') {
            _self.$componentSelector.addClass('is-visible');

            setTimeout(function () {
                jsCookie.set('bhf-policy-update', 'was-shown', { expires: 365 });
            }, 2500);
        }
    }
}

$(() => {
    let cookiesComponentHolder = '.g-policy-update';
    
    $(cookiesComponentHolder).each(function(): void {
        let cookiesComponent: any = new CookiesComponent($(this));
    });
});
