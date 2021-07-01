import * as $ from 'jquery'; 

class ScrollToTopComponent {

    private $componentSelector: JQuery; 
    
    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.init();
    }

    init(): void {
        this.$componentSelector.on('click', function () {
            $("html, body").animate({
                scrollTop: 0
            }, 600);
            return false;
        });
    }
}

$(() => {
    let scrollToTopComponentHolder = '#back-to-top';
    
    $(scrollToTopComponentHolder).each(function(): void {
        let scrollToTopComponent: any = new ScrollToTopComponent($(this));
    });
});