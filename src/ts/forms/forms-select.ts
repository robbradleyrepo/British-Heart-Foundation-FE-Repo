import * as $ from 'jquery'; 

class FormSelectElement {
    private $componentSelector: JQuery;
    private $selectElement: JQuery;

    constructor($theSelectElementHolder: JQuery) {
        this.$componentSelector = $theSelectElementHolder;
        this.$selectElement = this.$componentSelector.find('select');
        this.appendOptGroup(); 
    } 

    appendOptGroup(): void { 
        this.$selectElement.append('<optgroup label="">'); 
    }
}

$(() => {
    const iosNative = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    
    if (iosNative === true) {
        let selectElementHolder = '.f-forms__select';

        $(selectElementHolder).each(function(): void {
            let formSelectElement: any = new FormSelectElement($(this));
        });
    }
});
