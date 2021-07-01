class ScrollMagicTriggers {

    private $componentSelector: JQuery;
    private controller: any;
    private triggerElemType: any;
    private newScene: any;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.controller = new ScrollMagic.Controller();
        this.triggerElemType = this.$componentSelector[0].tagName.toLowerCase();
        this.newScene = null;
        this.init()
    };

    init(): void {
        var that = this;
        switch (this.triggerElemType) {
            case 'section':
                that.$componentSelector.each(function( index, elem ) {
                    
                    $(elem).removeClass('animated');

                    that.newScene = new ScrollMagic.Scene({
                            duration: "200%",
                            offset: "10%",
                            triggerElement: elem,
                            triggerHook: "0.9"
                    })
                    .setClassToggle(elem, "animated")
                    .addTo(that.controller);
                });
                break;
            
            case 'div':
                that.$componentSelector.each(function( index, elem ) {
                    
                    that.newScene = new ScrollMagic.Scene({
                            duration: "100%",
                            offset: "10%",
                            triggerElement: elem,
                            triggerHook: "onEnter"
                    })
                    .setClassToggle(elem, "animated")
                    .addTo(that.controller);

                    if (that.newScene.addIndicators.length ) {
                        that.newScene.addIndicators();
                    }
                });
                break;

            case 'img':
                that.$componentSelector.each(function( index, elem ) {
                
                    var imageID = "#image-" + index
                    
                    if (index %2 == 1) {
                        var animate = "animate-right"
                    } else {
                        var animate = "animate-left"
                    }
                    
                    that.newScene = new ScrollMagic.Scene({
                            duration: "150%",
                            offset: 100,
                            triggerElement: elem,
                            triggerHook: "onEnter"
                        })
                        .setClassToggle(imageID, animate)
                        .addTo(that.controller);
                    });

                    if (that.newScene.addIndicators.length ) {
                        that.newScene.addIndicators();
                    }
                break;
        
            default:
                break;
        }
    };

};

$(() => {
    let scrollMagicTriggersHolder = '.animated';
    if ($(scrollMagicTriggersHolder).length > 0) {
        let scrollMagicTriggers: any = new ScrollMagicTriggers($(scrollMagicTriggersHolder));
    }
});