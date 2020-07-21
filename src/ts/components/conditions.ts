import * as $ from 'jquery'; 

class ConditionsComponent {

    private $componentSelector: JQuery;
    private $control: JQuery;
    private $result: JQuery;
    private $resultContainer: JQuery;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$control = this.$componentSelector.find('.c-conditions__core--header ul li');
        this.$result = this.$componentSelector.find('.c-conditions__core--results div');
        this.selectList();
    } 
    
    removeAll(): void {
        const _self = this;

        _self.$control.children('a').removeClass('active');
        _self.$result.removeClass('active');
    }
    
    selectList(): void { 
        const _self = this;

        _self.$control.on('click', function (e: any) {
            e.preventDefault();
            _self.removeAll();
            $(this).children('a').addClass('active');
            let i = $(this).index();
            _self.$result.eq(i).addClass('active');
        });
    }
}

$(() => {
    let conditionsComponentHolder = '.c-conditions';
    
    $(conditionsComponentHolder).each(function(): void {
        let conditionsComponent: any = new ConditionsComponent($(this));
    });
});
