import * as $ from 'jquery'; 

class FormComponent {

    private $componentSelector: JQuery; 
    private $expandControl: JQuery; 
    private $expandContent: JQuery; 

    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.$expandControl =  this.$componentSelector.find('.c-block-expand__control');
        this.$expandContent = this.$componentSelector.find('.c-block-expand__content');
        this.blockExpand();
    }
    
    blockExpand(): void { 
        const _self = this;
        _self.$expandContent.slideUp();
        
        _self.$expandControl.on('click', function (e: any) {
            e.preventDefault();
            _self.$expandContent.slideToggle();
        });

    }
}

$(() => {
    let formComponentHolder = '.c-block-expand';
    
    $(formComponentHolder).each(function(): void {
        let formComponent: any = new FormComponent($(this));
    });
});
