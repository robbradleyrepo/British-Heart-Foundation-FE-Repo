import * as $ from 'jquery'; 

class FormComponent {

    private $componentSelector: JQuery;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.addAddressLine(); 
    }
    
    addAddressLine(): void { 
        const _self = this;

        this.$componentSelector.click(function(e) {
            e.preventDefault();
            $(this).closest('.g-forms__element').siblings('.address-hidden').first().removeClass('address-hidden');
            
            if (!$(this).parent('.g-forms__element').siblings('.address-hidden').length) {
                $(this).hide();
            }
        });
    }
}  

$(() => {
    let formComponentHolder = '.g-forms__element--control-address';
    
    $(formComponentHolder).each(function(): void {
        let formComponent: any = new FormComponent($(this));
    });
});