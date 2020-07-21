import * as $ from 'jquery';

class NumberSelectorComponent {

    private $componentSelector: JQuery;
    private $numberSelectorInput: JQuery;
    private $minusIndicator: JQuery;
    private $plusIndicator: JQuery;

    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.$numberSelectorInput = this.$componentSelector.find('.f-forms--number-selector__input');
        this.$minusIndicator = this.$componentSelector.find('.minus-indicator');
        this.$plusIndicator = this.$componentSelector.find('.plus-indicator');
        this.handleNumbers();
    }

    handleNumbers(): void {
        this.$minusIndicator.on('click',  () => {
            let inputValue:any = this.$numberSelectorInput.val();
            inputValue = this.convertToNumber(inputValue);
            if (inputValue > 0) {
                inputValue -= 1;
                this.$numberSelectorInput.val(inputValue);
            }
            this.handleIndicators(inputValue);
        });

        this.$plusIndicator.on('click', () => {
            let inputValue:any = this.$numberSelectorInput.val();
            inputValue = this.convertToNumber(inputValue);
            if (inputValue < 99) {
                inputValue += 1;
                this.$numberSelectorInput.val(inputValue);
            }
            this.handleIndicators(inputValue);
        });

        this.$numberSelectorInput.on('change', () => {
            let inputValue:any = this.$numberSelectorInput.val();
            this.handleIndicators(inputValue);
        });
    }

    convertToNumber(inputValue: any): Number {
        if (isNaN(Number(inputValue))) {
            return undefined;
        } else {
            return Number(inputValue);
        }
    }

    handleIndicators(inputValue: any) {
        switch (inputValue) {
            case 0:
                this.$minusIndicator.addClass('disabled');
                this.$plusIndicator.removeClass('disabled');
                break;
            case 99:
                this.$minusIndicator.removeClass('disabled');
                this.$plusIndicator.addClass('disabled');
                break;
            default:
                this.$minusIndicator.removeClass('disabled');
                this.$plusIndicator.removeClass('disabled');
                break;
        }
    }
}

$(() => {
    let numberSelectorComponentHolder = '.f-forms--number-selector-wrapper';
    
    $(numberSelectorComponentHolder).each(function(): void {
        let numberSelectorComponent: any = new NumberSelectorComponent($(this));
    });
});
