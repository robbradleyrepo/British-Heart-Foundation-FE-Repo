import * as $ from 'jquery';
const hoverIntent = require('hoverintent');

class BeatAnimComponent {

    private $componentSelector: JQuery;
    
    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.defaults();
        this.initBeatAnim();
    }

    defaults(): void {
        const _self = this;
        // wait and remove onload animation 
        // time = allow full anim sequence to complete
        setTimeout(function () {
            _self.$componentSelector.removeClass('animation-beat');
            //_self.$componentSelector.addClass('animation-beat');
        }, 2000);

        setTimeout(function () {
            _self.$componentSelector.removeClass('animation-beat');
        }, 2100);

        setTimeout(function () {
            _self.$componentSelector.addClass('animation-beat');
        }, 2200);

        setTimeout(function () {
            _self.$componentSelector.removeClass('animation-beat');
        }, 4200);

        setTimeout(function () {
            _self.$componentSelector.addClass('animation-beat');
        }, 4300);

        setTimeout(function () {
            _self.$componentSelector.removeClass('animation-beat');
        }, 6300);
    }

    restartAnim(): void {
        const _self = this;
        // because class needs to be removed in order to add it again = restart animation
        // time = allow full anim sequence to complete, accounting for easings too
        setTimeout(function () {
            _self.$componentSelector.removeClass('animation-repeat');
        }, 2000);
    }

    initBeatAnim(): void {
        const _self = this;
        
        setTimeout(function () {

            if ( _self.$componentSelector.hasClass('singlebeat') ) {
                
                _self.$componentSelector.children('span').each(function() {
                    hoverIntent(this, function(sensitivity: 5) {
                        
                        // animation + callback
                        $(this).parent().addClass('animation-repeat').one('animationend webkitAnimationEnd', function(e: any) { 
                            _self.restartAnim();
                        });
    
                    }, function() {
                        return false;
                    });
                });
            }
            
            if ( _self.$componentSelector.hasClass('bigbeat') ) {

                _self.$componentSelector.each(function() {
                    hoverIntent(this, function(sensitivity: 6) {

                        // animation + callback
                        $(this).addClass('animation-repeat').one('animationend', function(e: any) {
                            _self.restartAnim();
                        });
                        
                    }, function() {
                        return false;
                    });
                });
            }

        }, 6300);
    }
}

$(() => {
    let beatAnimComponentHolder = '.g-logo';
    
    $(beatAnimComponentHolder).each(function(): void {
        let beatAnimComponent: any = new BeatAnimComponent($(this));
    });
});
