import * as $ from 'jquery';

class QuoteTile {

    private $componentSelector: JQuery;
    private $quoteCopy: JQuery;
    private originalCopy: Array<string>;

    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.$quoteCopy = this.$componentSelector.find('.c-quote-tiles__item--copy');
        this.originalCopy = [];
        
        this.init();
        this.resize();
    }
    
    resize(): any {
        var resizeId: any;
        $(window).resize(() => {
            clearTimeout(resizeId);
            resizeId = setTimeout(this.init(), 500);
        });
    }

    init(): any {
        var _self = this;
        var characterLimit: any = $('.g-nav-primary__top').is(':visible') ? 500 : 292;

        $(this.$quoteCopy).each(function(): void {
            var id = $(this).closest('.c-quote-tiles__item--outer').data('id');
            var copyContainer = $(this);

            if(!_self.originalCopy[id]) {
                _self.originalCopy[id] = copyContainer.html();
            }
            
            copyContainer.data('originalHeight',copyContainer.height());

            if (_self.originalCopy[id]) {
                
                var originalText = _self.originalCopy[id];
                var characterCount = $(originalText).text().length;

                if (characterCount >= characterLimit) {
                    this.innerHTML = _self.originalCopy[id].slice(0, characterLimit);
                    copyContainer.css('max-height', copyContainer.find('.hidden-text').height());
                    copyContainer.addClass('hidden-text');
                    var readMore = _self.$componentSelector.find('.c-quote-tiles__item--outer[data-id="' + id + '"]').find('.c-quote-tiles__item--cta');
                    
                    readMore.hide();
                    readMore.show();

                    readMore.on('click', function() {
                        window.setTimeout(function() {
                            _self.showMore(id);
                        }, 200);
                    });
                }
            }
        });
    }

    showMore(id: any): void {
        var wrapWithid = this.$componentSelector.find('.c-quote-tiles__item--outer[data-id="' + id + '"]');
        wrapWithid.find('.c-quote-tiles__item--cta').hide();
        var copy = wrapWithid.find('.c-quote-tiles__item--copy');
        copy.css('max-height', 'initial');
        copy.removeClass('hidden-text');
        copy.html(this.originalCopy[id]);
    }
}

$(() => {
    let quoteTileComponentHolder = '.c-quote-tiles';
    
    $(quoteTileComponentHolder).each(function(): void {
        let quoteTileComponent: any = new QuoteTile($(this));
    });
});
