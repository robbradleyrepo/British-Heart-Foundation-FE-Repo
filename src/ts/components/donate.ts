import * as $ from 'jquery';

class DonateComponent {

    private $componentSelector: JQuery;
    private $donationValueBtn: JQuery;
    private $donationValueInput: JQuery;
    private $donationMonthlyPreset: JQuery;
    private $donationSinglePreset: JQuery;
    private $donationRadios: JQuery;
    private $donationForm: JQuery;
    private $formSubmitBtn: JQuery;
    private $checkoutList: JQuery;
    private $donationAmount: JQuery;
    private $totalAmount: JQuery;
    private $removeDonationLink: JQuery;
    private $boostDonation: JQuery;
    
    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$donationValueBtn = this.$componentSelector.find('.c-donate__amount');
        this.$donationValueInput = this.$componentSelector.find('.c-donate__donation-amount');
        this.$donationMonthlyPreset = this.$componentSelector.find('.c-donate__presets.is-monthly');
        this.$donationSinglePreset = this.$componentSelector.find('.c-donate__presets.is-single');
        this.$donationRadios = this.$componentSelector.find('.c-donate__radios');
        this.$donationForm = this.$componentSelector.find('form');
        this.$formSubmitBtn = this.$componentSelector.find('input[type="submit"]');
        this.$checkoutList = $('.c-checkout-order').first();
        this.$donationAmount = $('.donation-item .c-checkout-order__amount');
        this.$totalAmount = $('.total-amount .c-checkout-order__amount');
        this.$removeDonationLink = $('.donation-item .c-checkout-order__control');
        this.$boostDonation = $('.c-boost-donation');
        this.trimEmptySpacesOnEnter();
        this.fillValuesIn();
        this.swapPresets();
        this.submitFromIfNotEmpty();
        this.setupForCheckout();
    }

    setupForCheckout() {
        if (this.$checkoutList.length > 0) {
            this.addDonation();
            
            let checkoutItems = this.$checkoutList.find('li:not(.hidden) .c-checkout-order__amount');
            let sum = 0;
            $.each(checkoutItems, function(item, value) { 
                sum += parseFloat($(value).html().substring(1));
            });

            this.scrollDownToTheForm();
            $('.total-amount .c-checkout-order__amount').html('£' + sum.toFixed(2));

            this.$removeDonationLink.on('click', () => {
                this.removeDonation();
            });
        }
    }

    addDonation() {
        let $_self = this;
        if (window.location.search.length > 0) {
            let donationValue = window.location.search.split('=')[1];
            $_self.$donationAmount.html('£' + parseFloat(donationValue).toFixed(2));
            $_self.$checkoutList.find('.donation-item').removeClass('hidden');
            $_self.$componentSelector.hide();
            this.$boostDonation.removeClass('hidden');
        }
    }

    removeDonation() {
        let $_self = this;
        $_self.$checkoutList.find('.donation-item').addClass('hidden');
        $_self.$componentSelector.show();
        window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
        this.scrollDownToTheForm();
        this.$boostDonation.addClass('hidden');
    }

    scrollDownToTheForm() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(".g-forms__inner").offset().top
        }, 100);
    }

    trimEmptySpacesOnEnter() {
        let $_self = this;

        $_self.$donationValueInput.on('input change', function() {
            let match = (/(\d{0,10})[^.]*((?:\.\d{0,2})?)/g).exec($(this).val().toString().replace(/[^\d.]/g, ''));
            $(this).val(match[1] + match[2]);
        });
    }

    fillValuesIn(): void {
        let $_self = this;

        this.$donationValueBtn.click(function(e) {
            e.preventDefault();
            let donationValue = $(this).val().toString().substring(1);
            $_self.$donationValueInput.val(donationValue);
            if ($_self.$checkoutList.length == 0) {
                //this means you're not on a checkout page
                $_self.$formSubmitBtn.trigger('click');
            }
        });
    }

    swapPresets(): void {
        let $_self = this;
        let $inputRadio = $_self.$donationRadios.find('input[type="radio"]');

        $inputRadio.on('change', function() {

            if ($(this).is('#c-donate__single-donation')) {
                $_self.$donationMonthlyPreset.hide();
                $_self.$donationSinglePreset.show().css('display', 'flex');
            } else {
                $_self.$donationSinglePreset.hide();
                $_self.$donationMonthlyPreset.show().css('display', 'flex');
            }
        });
    }

    submitFromIfNotEmpty() {
        let $_self = this;

        this.$formSubmitBtn.click(function(e) {
            let inputValue = $_self.$donationValueInput.val().toString();
            if ( !inputValue ) {
                e.preventDefault();
            }
        });
    }

}

$(() => {
    let donateComponentHolder = '.c-donate';
    
    $(donateComponentHolder).each(function(): void {
        let donateComponent: any = new DonateComponent($(this));
    });
});
