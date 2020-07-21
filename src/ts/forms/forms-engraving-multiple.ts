import * as $ from 'jquery'; 

class EngravingComponent {

    private $componentSelector: JQuery; 
    private $fieldset: JQuery;
    private $ctaWrapper: JQuery;
    private $addControl: JQuery;
    private $removeControl: JQuery; 
    private $faqControl: JQuery;

    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.$fieldset =  this.$componentSelector.find('fieldset');
        this.$ctaWrapper = this.$componentSelector.find('.g-forms__element--cta-wrapper');
        this.$addControl =  this.$componentSelector.find('.cta__add');
        this.$removeControl = this.$componentSelector.find('.cta__remove');
        this.$faqControl = this.$componentSelector.find('.cta__control-faq');
        
        this.defaults(); 
        this.addName();
        this.removeName();
        this.faq();
        this.dateValidation();
    }

    defaults(): void {
        this.$fieldset.first().find(this.$ctaWrapper).hide();
        this.showFieldsets();
    }

    showFieldsets() {
        this.$componentSelector.find('fieldset').each(function() {
            let nameInput = $(this).find('.captialize');
            if (nameInput.val()) {
                $(this).addClass('is-visible');
            }
        });
    }

    toggleAttributes(): void { 
        
        $(this.$fieldset).each(function () {
            
            if ( !$(this).hasClass('is-visible') ) {
                $(this).find('input').attr('disabled','').val('');
                $(this).find('.captialize').attr('data-parsley-required','false');
                $(this).find('.captialize').attr('aria-required','false');
                $(this).find('.captialize').val('');
            } else {
                $(this).find('input').removeAttr('disabled');
                $(this).find('.captialize').attr('data-parsley-required','true');
                $(this).find('.captialize').attr('aria-required','true');
            }

            if ($('fieldset.is-visible').length == 1) {
                $('fieldset.is-visible').find('.g-forms__element--cta-wrapper').hide();
            }
        
        });
    }
    
    addName(): void { 
        const _self = this;
        
        _self.$addControl.on('click', function (e: any) {
            e.preventDefault(); 
            if ($(this).hasClass('disabled')) {
                return;
            }
            _self.$fieldset.find(_self.$ctaWrapper).show();
            $([document.documentElement, document.body]).animate({
                scrollTop: $("fieldset.is-visible").last().offset().top
            }, 100);
            _self.$fieldset.not('.is-visible').first().addClass('is-visible');
            if ($('fieldset.is-visible').length > 4) {
                _self.$addControl.addClass('disabled');
                _self.$ctaWrapper.find('.disabled-message').removeClass('hidden');
            } else {
                _self.$addControl.removeClass('disabled');
            }
            _self.toggleAttributes();
        });

    }

    removeName(): void {
        const _self = this;

        _self.$removeControl.on('click', function (e: any) {
            e.preventDefault();
            if ($('fieldset.is-visible').length > 1) { 
                $(this).closest(_self.$fieldset).removeClass('is-visible');
            } 
            if ($('fieldset.is-visible').length > 4) {
                _self.$addControl.addClass('disabled');
                _self.$ctaWrapper.find('.disabled-message').removeClass('hidden'); 
            } else {
                _self.$addControl.removeClass('disabled');
                _self.$ctaWrapper.find('.disabled-message').addClass('hidden');
            }
            _self.toggleAttributes();
        });
    }

    dateValidation(): void {
        $('.hos-date-input').on('change', function() {
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

    faq(): void { 
        const _self = this;

        _self.$faqControl.on('click', function (e: any) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: 
                $('.g-forms__copy').offset().top - 100 
            }, 400);
        });
    }
}

$(() => {
    let engravingComponentHolder = '.g-forms__engraving--mulitple';
    
    $(engravingComponentHolder).each(function(): void {
        let engravingComponent: any = new EngravingComponent($(this));
    });
});
