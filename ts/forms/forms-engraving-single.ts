import * as $ from 'jquery'; 

class EngravingComponent {

    private $componentSelector: JQuery; 
    private $faqControl: JQuery;

    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.$faqControl = this.$componentSelector.find('.cta__control-faq');
        this.faq();
        this.dateValidation();
    }

    faq(): void { 
        const _self = this;

        _self.$faqControl.on('click', function (e: any) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: 
                $('.g-forms__copy').offset().top - 100 
            }, 400);
        });
    }

    dateValidation(): void {
        $('#g-forms__element-input__2').on('change', function() {
            if ($(this).val() > 0) {
                $(this).attr('data-parsley-required','true');
                $(this).attr('data-parsley-excluded','false');
                $(this).attr('aria-required','true');
            } else {
                $(this).attr('data-parsley-required','false');
                $(this).attr('data-parsley-excluded','true');
                $(this).attr('aria-required','false');
            }
        });
    }
}

$(() => {
    let engravingComponentHolder = '.g-forms__engraving--single';
    
    $(engravingComponentHolder).each(function(): void {
        let engravingComponent: any = new EngravingComponent($(this));
    });
});