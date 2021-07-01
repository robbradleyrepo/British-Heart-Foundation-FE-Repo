/*
        This component is mainly used in the microsite pages. It requires API call which is
        defined in the html as a data-attribute. It uses the counterup and waypoints plugins to show the 
        numbers in animation and on scroll.
    */
   class TotaliserComponent {

    private $componentSelector: JQuery;
    private $totalRaised: any;
    private $totalConnected: any;
    private $totalX: any;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.initTotaliserComponent();
    };

    initTotaliserComponent(): void {
        this.$totalRaised = $(this.$componentSelector).find('[data-total-raised]');
        this.$totalConnected = $(this.$componentSelector).find('[data-total-connected]');
        this.$totalX = $(this.$componentSelector).find('[data-total-x]');

        if ($(this.$componentSelector).data('apiUrl').length > 0) {
            this.makeAPICall(this.$componentSelector);
        } else {
            this.$totalRaised.html(this.$totalRaised.data('totalRaised'));
            this.$totalRaised.parent().css('width', this.$totalRaised.width() + 20);
            this.initiateCounter(this.$totalRaised);

            this.$totalConnected.html(this.$totalConnected.data('totalConnected'));
            this.$totalConnected.parent().css('width', this.$totalConnected.width() + 20);
            this.initiateCounter(this.$totalConnected);

            this.$totalX.html(this.$totalX.data('totalX'));
            this.$totalX.parent().css('width', this.$totalX.width() + 20);
            this.initiateCounter(this.$totalX);
        }
    };

    makeAPICall(componentSelector: any): void {
        var $_self = $(componentSelector);
        var apiUrl = $_self.data('apiUrl');
        var that = this;

        if ($_self.data('apiUrl')) {
            $.get(apiUrl, function(data) {
                if (that.$totalRaised.length > 0) {
                    that.$totalRaised.html(data.totalRaised);
                    that.$totalRaised.parent().css('width', that.$totalRaised.width() + 20);
                    that.initiateCounter(that.$totalRaised);
                }

                if (that.$totalConnected.length > 0) {
                    that.$totalConnected.html(data.numberOfFundraisersConnected);
                    that.$totalConnected.parent().css('width', that.$totalConnected.width() + 20);
                    that.initiateCounter(that.$totalConnected);
                }

                if (that.$totalX.length > 0) {
                    that.$totalX.html(data.totalX);
                    that.$totalX.parent().css('width', that.$totalX.width() + 20);
                    that.initiateCounter(that.$totalX);
                }
            });
        }
    };

    initiateCounter($element: any): void {
        $element.counterUp({
            delay: 20,
            time: 1000,
            beginAt: 0,
            offset: 97,
            callback: function () {
                $element.parent().css("width", "");
            }
        });
    };
};

$(() => {
    let totaliserComponentHolder = '.c-totaliser';
    
    $(totaliserComponentHolder).each(function(): void {
        let totaliserComponent: any = new TotaliserComponent($(this));
    });
});