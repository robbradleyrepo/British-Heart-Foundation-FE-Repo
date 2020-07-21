import * as $ from 'jquery'; 

class FormComponent {

    private $componentSelector: JQuery; 
    private $button: JQuery; 
    

    constructor($theComponentSelector: JQuery) { 
        this.$button =  $theComponentSelector.find('.button');         
        this.animateTo();
    }
    
    animateTo(): void { 
        const _self = this; 
        
        _self.$button.on('click', function (e: any) {
            e.preventDefault();

            $("html, body").animate({ scrollTop: 
                $('.c-featured-fears__header').offset().top - 100 
            }, 400);
       
        });

    }
}

$(() => {
    let formComponentHolder = '.c-challenge-share';
    
    $(formComponentHolder).each(function(): void {
        let formComponent: any = new FormComponent($(this));
    });
});
