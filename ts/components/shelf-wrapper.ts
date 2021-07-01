import * as $ from 'jquery'; 

class ShelfWrapperComponent {

    private $componentSelector: JQuery;     

    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector =  $theComponentSelector;
        this.addSubClass();
    }
    
    addSubClass(): void { 
        const _self = this;

        if (!_self.$componentSelector.hasClass('c-offbrand')) {
            
            if (!_self.$componentSelector.hasClass('is-grey')) {

                if (_self.$componentSelector.next().hasClass('is-grey') && _self.$componentSelector.prev().hasClass('is-grey')) {
                    _self.$componentSelector.addClass('is-default');
                }
                else if (!_self.$componentSelector.next().hasClass('is-grey') && _self.$componentSelector.prev().hasClass('is-grey')) {
                    if (_self.$componentSelector.next().hasClass('cs-shelf__wrapper')) {
                        _self.$componentSelector.addClass('is-pull-down');
                    }
                    else {
                        _self.$componentSelector.addClass('is-default');
                    }
                }
                else if (_self.$componentSelector.next().hasClass('is-grey') && !_self.$componentSelector.prev().hasClass('is-grey')) {
                    _self.$componentSelector.addClass('is-pull-up');
                }
            }
            else {

                if (!_self.$componentSelector.next().hasClass('is-grey') && !_self.$componentSelector.prev().hasClass('is-grey')) {
                    _self.$componentSelector.addClass('is-default');
                }
                else if (!_self.$componentSelector.prev().hasClass('is-grey') && _self.$componentSelector.next().hasClass('is-grey')) {
                    _self.$componentSelector.addClass('is-pull-down');
                }
                else if (_self.$componentSelector.prev().hasClass('is-grey') && !_self.$componentSelector.next().hasClass('is-grey')) {
                    _self.$componentSelector.addClass('is-pull-up');
                }
            }
        }
    }
}

$(() => {
    let shelfwrapperHolder = '.cs-shelf__wrapper';
    
    $(shelfwrapperHolder).each(function(): void {
        new ShelfWrapperComponent($(this));
    });
});
