/*
    By default on scroll will be activated both desktop/mobile. If on scroll sticky is just 
    for mobile or desktop then It can be done using the data attribute data-sticky-device. 
    By default the position of the sticky will be at the bottom, it can also be switched to 
    top/bottom by using the data attribute data-sticky-position. Data attributes are optional 
    and it will work with the default settings.
*/

import * as $ from 'jquery'; 

class StickyOnScroll {

    private $componentSelector: JQuery; 
    
    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.init();
    }

    init(): void {
        const deviceType = this.$componentSelector.data('sticky-device');
        const stickyPosition = this.$componentSelector.data('sticky-position');
        let  onScrollDevice = deviceType === undefined ? 'all' : deviceType;
        let  onScrollPosition = stickyPosition === undefined ? 'bottom' : stickyPosition;
        this.activateSticky(onScrollDevice, onScrollPosition);
    }

    activateSticky(device: string, position: string): void {
        const _self = this;

        switch (device) {
            case "mobile":
                $(window).on("resize scroll load", function(e) {

                    if (window.matchMedia("(min-width: 768px)").matches) {
                        _self.activateStickyOnLoad(position);
                    }
                    else {
                        _self.activateStickyOnScroll(position);
                    } 
                });
                break;
            case "desktop":
                $(window).on("resize scroll load", function(e) {

                    if (window.matchMedia("(min-width: 768px)").matches) {
                        _self.activateStickyOnScroll(position);
                    }
                    else {
                        _self.activateStickyOnLoad(position);
                    } 
                });
                break;
            default: 
                $(window).on("resize scroll load", function(e) {
                    _self.activateStickyOnScroll(position);
                });
        }
    }

    activateStickyOnLoad(position: string): void {
        const _self = this;
        _self.$componentSelector.addClass("is-sticky is-sticky--"+position);
        _self.$componentSelector.closest(".cs-shelf__column").css("min-height","unset");
    }

    activateStickyOnScroll(position: string): void {
        const _self = this;
        let elementPosition = (<any>_self.$componentSelector)[0].getBoundingClientRect();
        let elementCurrentPosisition = elementPosition.top + elementPosition.height;
        let defaultPosition = (<any>_self.$componentSelector.parent())[0].offsetTop;
        let isStickyActive = _self.$componentSelector.hasClass("is-sticky");

        if (elementCurrentPosisition <= 0 && isStickyActive === false) {
            _self.$componentSelector.addClass("is-sticky is-sticky--"+position);
        }

        if (window.pageYOffset <= defaultPosition && isStickyActive === true) {
            _self.$componentSelector.removeClass("is-sticky is-sticky--"+position);
        }
    }
}

$(() => {
    let stickyContentHolder = '.is-sticky-on-scroll';
    
    $(stickyContentHolder).each(function(): void {
        let stickyContentComponent: any = new StickyOnScroll($(this));
    });
});