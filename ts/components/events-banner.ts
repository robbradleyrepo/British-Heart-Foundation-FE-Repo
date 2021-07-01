import * as $ from 'jquery'; 

class StickyComponent {

    private $componentSelector: JQuery; 
    private $cta: JQuery;
    private $tiles: JQuery;
    
    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.$cta = $('.cta__action');
        this.$tiles = $('.c-tiles');
        this.initial();
        this.screenSize();
        this.scrollToTiles();
    }

    initial(): void {
        const _self = this;
        
        if ($(window).width() > 767 ) {
            _self.$componentSelector.removeClass('fixed');
            _self.stickyScroll();
        }
        
        else {
            _self.$componentSelector.removeClass('fixed');
        }
    }
    
    stickyScroll(): void { 
        const _self = this;
        const top = this.$componentSelector.offset().top;

        $(window).scroll(function (this: any) {

            var y = $(this).scrollTop();
            
            if (y >= top) {
                
                if ($(window).width() > 767 ) {
                    _self.$componentSelector.addClass('fixed');
                }
                
            }
            
            else {
                _self.$componentSelector.removeClass('fixed');
            } 
        });
 

    }

    screenSize(): void {
        const _self = this;

        $(window).resize(function() {
            _self.initial();
        });
    }

    scrollToTiles(): void {
        const _self = this;
        
        if (this.$tiles.length) {

            this.$cta.on('click', function (e: any) {
                e.preventDefault();
    
                $("html, body").animate({ scrollTop: 
                    _self.$tiles.offset().top - 200 
                }, 400);
           
            });
        }

    }
}

$(() => {
    let stickyComponentHolder = '.c-sticky';
    
    $(stickyComponentHolder).each(function(): void {
        let stickyComponent: any = new StickyComponent($(this));
    });
});
