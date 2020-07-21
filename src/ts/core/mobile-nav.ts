import * as $ from 'jquery';

class MobileNavComponent {

    private $componentSelector: JQuery;
    private $body: JQuery;
    private $navMasterControl: JQuery;
    private $searchMasterControl: JQuery;
    private $navScreen: JQuery;
    private $navClose: JQuery;
    private $navControl: JQuery;
    private $subNavControl: JQuery;
    private $navDesktop: JQuery;
    private $navActualMaster: JQuery;
    private $navActual: JQuery;
    private $navActualMain: JQuery;
    private $subNavActual: JQuery;
    private $backControl: JQuery;
    private $inputForm: JQuery;
    
    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$body = $('body');
        this.$navDesktop = $('.g-nav-primary');
        this.$navScreen = $('.g-screen-mobile');
        this.$navMasterControl = $('.mobile-control');
        this.$searchMasterControl = $('.search-control');
        this.$navClose = $('.g-nav-close');
        this.$navActualMaster = $('.g-nav-mobile');
        this.$navActual = this.$componentSelector.find('.g-nav-mobile__nav');
        this.$navActualMain = this.$componentSelector.find('.g-nav-mobile__main');
        this.$subNavActual = this.$componentSelector.find('.g-nav-mobile__nav--subnav');
        this.$navControl = this.$componentSelector.find('.g-nav-mobile__link');
        this.$subNavControl = this.$componentSelector.find('.g-nav-mobile__nav--link');
        this.$backControl = this.$componentSelector.find('.g-nav-mobile__back');
        this.$inputForm = this.$componentSelector.find('form');
        this.initMobileNavComponent();
    }

    initMobileNavComponent(): void {
        this.navMobileToggle();
        this.$navActualMaster.delay(500).show(); // delay to ensure no flickering as page loading
        this.$inputForm.find('label').prepend('<span class="bhfi bhfi-search" aria-hidden="true"></span>'); // added because of generic sitecore form
    }

    // open mobile nav
    openMobileNav(): void {
        this.$navDesktop.addClass('hide').attr('aria-hidden', 'true');
        this.$navActualMaster.addClass('active').attr('aria-hidden', 'false');
        this.$navScreen.addClass('active');
        this.$body.addClass('overflow-hidden');
        this.$navClose.addClass('active');
    }

    // close mobile nav
    closeMobileNav(): void {
        const _self = this;

        this.$navDesktop.removeClass('hide').attr('aria-hidden', 'false');
        this.$navActualMaster.removeClass('active').attr('aria-hidden', 'true');
        this.$navScreen.removeClass('active');
        this.$navClose.removeClass('active');

        setTimeout(function () {      
            _self.$body.removeClass('overflow-hidden');
        }, 300);
    }

    // event listeners
    navMobileToggle(): void  {
        const _self = this;

        // on primary nav open mobile
        _self.$navMasterControl.on('click', function (e: any) {
            e.preventDefault();
            _self.openMobileNav();
        });

        // on primary nav open mobile + search focus
        _self.$searchMasterControl.on('click', function (e: any) {
            e.preventDefault();
            _self.$inputForm.find('label').addClass('hide');
            _self.$inputForm.find('input:text').focus();
            // timeout w/ sufficient delay critical
            setTimeout(function() {
                _self.openMobileNav();
            }, 1000);
        });

        // close nav
        _self.$navClose.on('click', function (e: any) {
            e.preventDefault();
            _self.closeMobileNav();

            // resets
            setTimeout(function() {
                _self.$navActualMain.css('transform', 'translateX(0%)').css('visibility', 'visible').attr('aria-hidden','true');
                _self.$inputForm.find('label').removeClass('hide');
                _self.$inputForm.find('input:text').blur();
            }, 500);
        });

        // search focus / click
        _self.$inputForm.find('input:text').on('focus', function (e: any) {
            e.preventDefault();
            $(this).siblings('label').addClass('hide');
        });

        _self.$inputForm.find('label').on('click', function (e: any) {
            e.preventDefault();
            $(this).addClass('hide');
            $(this).siblings('input:text').focus();
        });

        _self.$inputForm.find('input:text').on('blur', function (e: any) {
            e.preventDefault();
            $(this).val('');
            $(this).siblings('label').removeClass('hide');
        });

        // submenu traversing
        _self.$navControl.on('click', function(e: any) {
            e.preventDefault();
            $(this).attr('aria-expanded', function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
            _self.$navActualMain.css('transform', 'translateX(-100%)');
            _self.$navActual.css('visibility', 'hidden'); 
            $(this).siblings('div').css('visibility', 'visible').attr('aria-hidden', function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
            _self.$navActualMaster.delay(350).animate({ scrollTop: 0 }, 100);
        });
 
        _self.$subNavControl.on('click', function(e: any) {
            e.preventDefault();
            _self.$navActualMain.css('transform', 'translateX(-200%)');
            _self.$subNavActual.css('transform', 'translateX(100%)').css('visibility', 'hidden').attr('aria-hidden', function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
            $(this).siblings('div').css('visibility', 'visible').attr('aria-hidden', function (i, attr) {
                return attr == 'true' ? 'false' : 'true'
            });
            _self.$navActualMaster.delay(350).animate({ scrollTop: 0 }, 100);
        });


        // Back CONTROL
        _self.$backControl.on('click', function (e: any) {
            e.preventDefault();

            // level 1 back
            if ( $(this).parent('.g-nav-mobile__nav').length > 0 ) {
                _self.$navActualMain.css('transform', 'translateX(0%)').css('visibility', 'visible').attr('aria-hidden', function (i, attr) {
                    return attr == 'true' ? 'false' : 'true'
                });
                $(this).closest('div').css('transform', 'translateX(100%)').css('visibility', 'visible').attr('aria-hidden', function (i, attr) {
                    return attr == 'true' ? 'false' : 'true'
                });
                $(this).siblings('div').css('visibility', 'hidden');
            }
            // level 2(+?) back
            else {  
                _self.$navActualMain.css('transform', 'translateX(-100%)');
            }
        });

    }
}

$(() => {
    let mobileNavComponentHolder = '.g-nav-mobile';
    
    $(mobileNavComponentHolder).each(function(): void {
        let mobileNavComponent: any = new MobileNavComponent($(this));
    });
});
