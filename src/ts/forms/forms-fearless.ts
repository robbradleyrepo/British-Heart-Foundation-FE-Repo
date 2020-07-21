import * as $ from 'jquery'; 

class FormComponent {

    private $componentSelector: JQuery;
    private $addressControl: JQuery;
    private $inputFear: JQuery;
    private $inputIntent: JQuery; 
    private $inputAmount: JQuery;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$addressControl = this.$componentSelector.find('.g-forms__element--control-address');
        this.$inputFear = this.$componentSelector.find('#g-forms__fear');
        this.$inputIntent = this.$componentSelector.find('#g-forms__intent');
        this.$inputAmount = this.$componentSelector.find('#g-forms__amount');
         
        this.expandAddress(); 
        this.getData(); 
    }
    
    expandAddress(): void { 
        const _self = this;

        this.$addressControl.click(function(e) {
            e.preventDefault();
            $(this).parent('div').siblings('.address-hidden').first().removeClass('address-hidden');
            
            if (!$(this).parent('div').siblings('.address-hidden').length) {
                $(this).hide();
            }
        });
        

    }


    parseQueryString(queryString: string) {
        const _self = this;
 
        const params: { [key: string]: string } = {};
        let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        
        
        $.each(params, function(fearType, fearData) {
             
            if ( fearType == "fear" ) {
                _self.$inputFear.val(fearData);
            }

            if ( fearType == "amount" && fearData != "0") {
                _self.$inputAmount.val(fearData);
            }

            if ( fearType == "desc" && fearData != "" ) {
                _self.$inputIntent.val(fearData);
            }

        });

        return params; 
    }

    getData(): void {
        const _self = this;
        this.parseQueryString(window.location.search);
    }

}  

$(() => {
    let formComponentHolder = '.g-forms';
    
    $(formComponentHolder).each(function(): void {
        let formComponent: any = new FormComponent($(this));
    });
});
