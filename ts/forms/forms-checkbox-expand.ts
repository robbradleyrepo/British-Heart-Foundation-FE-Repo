import * as $ from 'jquery';
declare function refreshParsley(selector: any): any;

class ExpandFieldComponent {

    private $componentSelector: JQuery;
    private $expandContent: JQuery;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$expandContent = this.$componentSelector.closest('.f-forms__element').find('.nested');
        this.fieldExpand();
    }

    fieldExpand(): void {
        const _self = this;

        this.$componentSelector.on('click', function () {

            if ($(this).prop('checked')) {
                _self.$expandContent.removeClass('hidden');
                _self.$expandContent.find('input, textarea').attr('data-parsley-required', 'true');
                _self.$expandContent.find('input, textarea').attr('data-parsley-excluded', 'false');
                _self.$expandContent.find('input, textarea').attr('aria-required', 'true');
                _self.$expandContent.find('input, textarea').val('');
            }

            else {
                _self.$expandContent.addClass('hidden');
                _self.$expandContent.find('input, textarea').attr('data-parsley-required', 'false');
                _self.$expandContent.find('input, textarea').attr('data-parsley-excluded', 'true');
                _self.$expandContent.find('input, textarea').attr('aria-required', 'false');
                _self.$expandContent.find('input, textarea');
                //refreshParsley(this.$componentSelector);
            }
        });
    }
}

$(() => {
    let expandFieldComponentHolder = '.f-forms__checkbox--expand';

    $(expandFieldComponentHolder).each(function (): void {
        let expandFieldComponent: any = new ExpandFieldComponent($(this));
    });
});
