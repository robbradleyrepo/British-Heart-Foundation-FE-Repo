import * as $ from 'jquery';
const hoverIntent = require('hoverintent');

class PrimaryNavComponent {

    private $componentSelector: JQuery;
    private $navMobile: JQuery;
    private $navPrimary: JQuery;
    private $navPrimaryTop: JQuery;
    private $navMegaLink: JQuery;
    private $navMega: JQuery;
    private $navScreen: JQuery;
    private $subNavLink: JQuery;
    private $subNav: JQuery;
    private $navMegaLinkPromo: JQuery;
    private $navSearch: JQuery;
    private $navSearchControl: JQuery;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$navPrimaryTop = this.$componentSelector.find('.g-nav-primary__top');
        this.$navPrimary = this.$componentSelector.find('.g-nav-primary__bottom');
        this.$navMegaLink = this.$componentSelector.find('.g-nav-primary__link');
        this.$navMegaLinkPromo = this.$componentSelector.find('.g-nav-primary__mega--promo');
        this.$navMega = this.$componentSelector.find('.g-nav-primary__mega');
        this.$navMobile = $('.g-nav-mobile');
        this.$navScreen = $('.g-screen');
        this.$navSearch = this.$componentSelector.find('.g-nav-primary__search');
        this.$navSearchControl = $('.g-nav-primary__search--control');
        this.$subNav = this.$componentSelector.find('.g-nav-primary__mega--subnav');
        this.$subNavLink = this.$componentSelector.find('.g-nav-primary__mega--link');
        this.initPrimaryNavComponent();
    }

    initPrimaryNavComponent(): void {
        this.navMegaToggle();
        this.subNavToggle();
    }

    // open nav
    openNav(this: any): void {
        this.$navMegaLink.attr('aria-expanded', 'false').removeClass('active');
        this.$navMega.not($(this)).removeClass('active').attr('aria-hidden', 'false');
        this.$navPrimaryTop.addClass('active');
        this.$navPrimary.addClass('active');
        this.$navScreen.addClass('active');
        this.$subNavLink.attr('aria-expanded', 'false').siblings('div').removeClass('active').attr('aria-hidden', 'true');
    }

    // close nav
    closeNav(): void {
        this.$navMega.removeClass('active').attr('aria-hidden', 'true');
        this.$navPrimary.removeClass('active');
        this.$navMegaLink.attr('aria-expanded', 'false').removeClass('active').siblings('ul').removeClass('active');
        this.$subNavLink.attr('aria-expanded', 'false').siblings('div').removeClass('active').attr('aria-hidden', 'true');
        this.$navPrimaryTop.removeClass('active');
        this.$navScreen.removeClass('active');
    }

    // open search
    openSearch(): void {
        this.$navPrimary.children('li').not(this.$navSearch).addClass('de-active');
        this.$navSearch.addClass('active').attr('aria-hidden', 'false');
        this.$navScreen.addClass('active');
        this.$navPrimaryTop.addClass('active');
    }

    // close search
    closeSearch(): void {
        const _self = this;

        if (_self.$navSearch.hasClass('active')) {
            _self.$navPrimary.children('li').not(_self.$navSearch).removeClass('de-active');
            _self.$navSearch.removeClass('active').attr('aria-hidden', 'true');
            _self.$navSearch.find('input:text').val('');
        }
    }

    // event listeners
    navMegaToggle(): void {
        const _self = this;

        // hover on (intent) on main nav
        _self.$navMegaLink.each(function () {
            hoverIntent(this, function (e: any) {
                e.preventDefault();
                _self.openNav();
                $(this).addClass('active').attr('aria-expanded', 'true').siblings('div').addClass('active').attr('aria-hidden', 'false');
            }, function () {
                return false;
            });
        });

        // touch only 
        _self.$navMegaLink.on('touchstart', function (e: any) {
            if (!$(this).hasClass('active')) {
                e.preventDefault();
            }
            _self.openNav();
            $(this).addClass('active').attr('aria-expanded', 'true').siblings('div').addClass('active').attr('aria-hidden', 'false');
        });

        // keyboard access only
        _self.$navMegaLink.keydown(function (e) {
            if (!$(this).hasClass('active')) {
                e.preventDefault();
            }
            if (e.keyCode == 13) { // enter key
                e.preventDefault();
                _self.openNav();
                $(this).addClass('active').attr('aria-expanded', 'true').siblings('div').addClass('active').attr('aria-hidden', 'false');
            }
        });

        // escape key out / close
        $('body').on('keyup', function (e: any) {
            e.preventDefault();
            if (e.keyCode == 27) { // escape key 
                e.preventDefault();
                _self.closeNav();
                _self.closeSearch();
            }
        });

        // search - with detection if meganav and/or search are already open
        _self.$navSearchControl.on('click touchstart', function (e: any) {
            e.preventDefault();
            if (!_self.$navSearch.hasClass('active')) {
                _self.openSearch();
                setTimeout(function () {
                    _self.$navSearch.find('input:text').focus();
                }, 500);
            }

            if (_self.$navMega.hasClass('active')) {
                _self.closeNav();
                _self.closeSearch();
                _self.openSearch();
                setTimeout(function () {
                    _self.$navSearch.find('input:text').focus();
                }, 500);
            }
        });

        // hover (intent) over screen and close meganav
        _self.$navScreen.each(function () {
            hoverIntent(this, function (e: any) {
                e.preventDefault();
                if (!_self.$navMobile.hasClass('active') && !_self.$navSearch.hasClass('active')) {
                    _self.closeNav();
                }
            }, function () {
                return false;
            });
        });

        // close nav and/or search on screen click
        _self.$navScreen.on('click touchstart', function (e: any) {
            e.preventDefault();
            if (!_self.$navMobile.hasClass('active') && _self.$navSearch.hasClass('active')) {
                _self.closeNav();
                _self.closeSearch();
            } else {
                _self.closeNav();
            }
        });

        // effectively this bypasses hover intent on top nav (above meganav), and immediately closes meganav so top links are in default state / ready 
        _self.$navPrimaryTop.on('mouseenter', function (e: any) {
            e.preventDefault();
            if (!_self.$navMobile.hasClass('active') && !_self.$navSearch.hasClass('active')) {
                _self.closeNav();
                _self.closeSearch();
            }
        });

        // orientation change - close
        window.addEventListener("orientationchange", function () {
            _self.closeNav();
            _self.closeSearch();
        }, false);

        // resize viewport - close
        let resizeTimer: any;
        $(window).on('resize', function (e) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                _self.closeNav();
                _self.closeSearch();
            }, 300);
        });

    }

    subNavToggle(): void {
        const _self = this;

        // traverse submenu 
        _self.$subNavLink.each(function () {
            hoverIntent(this, function (sensitivity: 3) {
                _self.$subNavLink.not($(this)).attr('aria-expanded', 'false').siblings('div').removeClass('active').attr('aria-hidden', 'true');
                $(this).attr('aria-expanded', 'true').siblings('div').addClass('active').attr('aria-hidden', 'false');
            }, function () {
                return false;
            });
        });

        // traverse submenu - keyboard
        _self.$subNavLink.on('touchstart keyup', function (e: any) {
            if (!$(this).hasClass('active')) {
                e.preventDefault();
            }
            _self.$subNavLink.not($(this)).removeClass('active').attr('aria-expanded', 'false').siblings('div').removeClass('active').attr('aria-hidden', 'true');
            $(this).addClass('active').attr('aria-expanded', 'true').siblings('div').addClass('active').attr('aria-hidden', 'false');
        });

        // traverse submenu - clear open submenu 
        _self.$navMegaLinkPromo.each(function () {
            hoverIntent(this, function (sensitivity: 3) {
                _self.$subNav.removeClass('active').attr('aria-hidden', 'true');
                _self.$subNavLink.attr('aria-expanded', 'false');
            }, function () {
                return false;
            });
        });

        // traverse submenu - clear open submenu - keyboard
        _self.$navMegaLinkPromo.on('touchstart keyup', function () {
            _self.$subNav.removeClass('active').attr('aria-hidden', 'true');
            _self.$subNavLink.attr('aria-expanded', 'false');
        });
    }
}

$(() => {
    let primaryNavComponentHolder = '.g-nav-primary';

    $(primaryNavComponentHolder).each(function (): void {
        let primaryNavComponent: any = new PrimaryNavComponent($(this));
    });
});
