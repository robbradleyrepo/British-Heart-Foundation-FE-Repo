import * as $ from 'jquery'; 

class FormElementComponent {

    private $componentSelector: JQuery; 
    private $validatedField: JQuery;
    private $elementFlag: JQuery;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$validatedField =  this.$componentSelector.find('[data-parsley-required]');
        this.$elementFlag = this.$componentSelector.find('.f-forms__element--label');
        this.setOptionalFlag();
    } 

    setOptionalFlag(): void {
        const _self = this;
        const spanToAdd = '<span class="f-forms__element--optional-flag">(optional)</span>';

        //this is the case of radio buttons. They do not have a '.f-forms__element--label' inside of a '.f-forms__element", but a <legend> tag at the top of a fieldset instead
        if ($(this.$validatedField).attr('data-parsley-required') == "false" && _self.$componentSelector.find('.f-forms__radio').length) {
            let parent = _self.$componentSelector.parent();
            parent.find('legend').append(spanToAdd);
        }

        //this is for every other input field we have except for radio buttons
        this.$validatedField.each(function() {
            //parent having hidden class means nested checkboxes with initially not required fields which may become required after appearing
            if ( $(this).attr('data-parsley-required') == "false" && !$(this).parent().hasClass('hidden')) {
                _self.$elementFlag.after(spanToAdd);
            } else if ( $(this).attr('data-parsley-required') == "true" ) { 
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
