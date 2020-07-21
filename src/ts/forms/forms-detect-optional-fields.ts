import * as $ from 'jquery'; 

class FormElementComponent {

    private $componentSelector: JQuery; 
    private $elementActual: JQuery;
    private $elementFlag: JQuery;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$elementActual =  this.$componentSelector.find('.f-forms__element--actual');
        this.$elementFlag = this.$componentSelector.find('.f-forms__element--label');
        this.setOptionalFlag();
        this.detectMandatoryFields();
    } 

    detectMandatoryFields(): void { 
        const _self = this;

        // this.$elementActual.on('focusout', function(e) { 
        //     _self.toggleOptionalFlag();
        // });
    }

    setOptionalFlag(): void {
        const _self = this;

        this.$elementActual.each(function() {
            
            if ( $(this).attr('data-parsley-required') == "false" ) {
                _self.$elementFlag.after('<span class="f-forms__element--optional-flag">(optional)</span>');
            }

            else if ( $(this).attr('data-parsley-required') == "true" ) { 
                _self.$elementFlag.find('.f-forms__element--optional-flag').remove();
            }
        });
    }
   
}

$(() => {
    let formElementComponentHolder = '.f-forms__element';
    
    $(formElementComponentHolder).each(function(): void {
        let formElementComponent: any = new FormElementComponent($(this));
    });
});
