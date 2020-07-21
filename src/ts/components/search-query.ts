import * as $ from 'jquery'; 

class FormComponent {

    private $componentSelector: JQuery; 
    private $buttonData: JQuery; 
    

    constructor($theComponentSelector: JQuery) { 
        this.$buttonData =  $theComponentSelector;
         
        this.sendData();
    }
    
    sendData(): void { 
        const _self = this;
        
        _self.$buttonData.on('click', function (e: any) {
            e.preventDefault();
            let fear = $(this).data('fear');
            let desc = $(this).data('desc');
            let amount = $(this).data('amount');
            let href = $(this).data('href');
            window.location.href = href + '?fear=' + fear + '&amount=' + amount + '&desc=' + desc;
        });

    }
}

$(() => {
    let formComponentHolder = '.button-with-data';
    
    $(formComponentHolder).each(function(): void {
        let formComponent: any = new FormComponent($(this));
    });
});
