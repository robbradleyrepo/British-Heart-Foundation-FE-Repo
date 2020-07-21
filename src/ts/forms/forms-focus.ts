import * as $ from 'jquery'; 

class FormComponent {

    private $componentSelector: JQuery;
    private $inputElement: JQuery; 
    private $textareaElement: JQuery;
    private $selectElement: JQuery;
    

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$inputElement = this.$componentSelector.find('input[type=email], input[type=number], input[type=text], input[type=url], input[type=password], input[type=tel]');
        this.$textareaElement = this.$componentSelector.find('textarea'); 
        this.labelFocus(); 
    } 

    labelFocus(): void { 
        const _self = this;
        
        this.$inputElement.focus(function(e) {
            e.preventDefault(); 
            $(this).closest('.f-forms__element').children('label').addClass('focus');
        });

        this.$inputElement.blur(function(e) {
            e.preventDefault(); 
            $(this).closest('.f-forms__element').children('label').removeClass('focus');
        });

        this.$textareaElement.focus(function(e) {
            e.preventDefault();
            $(this).siblings('label').addClass('focus');
            $(this).parent('.f-forms__textarea').siblings('label').addClass('focus');
        });

        this.$textareaElement.blur(function(e) {
            e.preventDefault();
            $(this).siblings('label').removeClass('focus');
            $(this).parent('.f-forms__textarea').siblings('label').removeClass('focus');
        });
    }
}

$(() => {
    let formComponentHolder = '.g-forms__element, .f-forms__element';
    
    $(formComponentHolder).each(function(): void {
        let formComponent: any = new FormComponent($(this));
    });
});
