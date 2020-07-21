import * as $ from 'jquery';
const jsCookie = require('js-cookie'); // Usage and Docs: https://www.npmjs.com/package/js-cookie

class CookiesComponent {

    private $componentSelector: JQuery;
    private $cookieCta: JQuery;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$cookieCta = this.$componentSelector.find('.g-cookies__cta button');
        this.checkCookieOnLoad();
        this.setCookieOnAccept();
        this.adjustPositionOnResize();
        this.setPosition();
    }

    checkCookieOnLoad(): void {
        const _self = this;

        let cookieVal: string = jsCookie.get('bhf-cookies-policy');
        if (cookieVal) {
            this.$componentSelector.removeClass('is-visible');
        } else {
            this.$componentSelector.addClass('is-visible');
        }
    }

    setCookieOnAccept(): void {
        const _self = this;

        _self.$cookieCta.on('click', function(e) {
            e.preventDefault;
            jsCookie.set('bhf-cookies-policy', 'is-accepted', { expires: 365 });
            _self.$componentSelector.removeClass('is-visible');

            let $policyUpdate = $('.g-policy-update');

            if ($policyUpdate.length) {
                $policyUpdate.hide();
            }
        });
    }

    setPosition(): void {
        const _self = this;
        let $cookiesBanner = $('.g-policy-update');
        setTimeout(function () {
            if ($cookiesBanner.length && $cookiesBanner.is(':visible')) {
                let cookiesBannerHeigh = $cookiesBanner.outerHeight();
                _self.$componentSelector.css('bottom', cookiesBannerHeigh + 'px');
            }
        }, 50);
    }

    adjustPositionOnResize(): void {
        const _self = this;

        $(window).on("resize", function(e) {
            _self.setPosition();
        });
    }

}

$(() => {
    let cookiesComponentHolder = '.g-cookies';
    
    $(cookiesComponentHolder).each(function(): void {
        let cookiesComponent: any = new CookiesComponent($(this));
    });
});
