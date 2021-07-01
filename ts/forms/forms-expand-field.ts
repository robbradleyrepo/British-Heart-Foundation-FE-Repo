import * as $ from 'jquery'; 

class ExpandFieldComponent {

    private $componentSelector: JQuery;
    private $expandContent: JQuery;

    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.$expandContent = this.$componentSelector.closest('.g-forms__element').next('.hidden');
        this.fieldExpand();
    }
    
    fieldExpand(): void { 
        const _self = this;

        this.$componentSelector.change(function() {
 
            if ($(this).val() == "other") {
                _self.$expandContent.removeClass('hidden'); 
                _self.$expandContent.find('input, textarea').attr('data-parsley-required','true');
                _self.$expandContent.find('input, textarea').attr('data-parsley-excluded','false');
                _self.$expandContent.find('input, textarea').attr('aria-required','true');
            }

            else { 
                _self.$expandContent.addClass('hidden');
                _self.$expandContent.find('input, textarea').attr('data-parsley-required','false');
                _self.$expandContent.find('input, textarea').attr('data-parsley-excluded','true');
                _self.$expandContent.find('input, textarea').attr('aria-required','false');
            }
              
        });
    }
}

$(() => {
    let expandFieldComponentHolder = '.expand-field';
    
    $(expandFieldComponentHolder).each(function(): void {
        let expandFieldComponent: any = new ExpandFieldComponent($(this));
    });
});
