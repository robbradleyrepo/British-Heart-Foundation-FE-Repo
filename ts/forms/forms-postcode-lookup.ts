import axios from "axios";

class PostcodeComponent {

    private $componentSelector: JQuery;
    private $formMaster: JQuery;
    private $postcodeElement: JQuery;
    private $buttonElement: JQuery;
    private $labelElement: JQuery;
    private $listboxElement: JQuery;
    private isLookupActive: boolean;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.$formMaster = this.$componentSelector.parents('form');
        this.$postcodeElement = this.$componentSelector.find('.f-forms__element--postcode');
        this.$buttonElement = this.$componentSelector.find('.is-postcode-button');
        this.$labelElement = this.$componentSelector.find('.is-postcode-label');
        this.$listboxElement = this.$componentSelector.find('.f-forms__listbox');
        this.init();
    }

    init(): void {
        this.isLookupActive = false;
        this.events();
    }

    events(): void {
        var that = this;
        var $_self = this.$componentSelector;
        var $formButton = $_self.find('.is-postcode-button');
        var $formPostcode = $('.f-forms__element--postcode');
        var $countryElement = $('.f-forms__element--country');


        $formButton.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            that.postCodeLookup();
        });

        $formPostcode.keydown(function (e) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            // need to account for key EVENT
            if (that.$buttonElement.is(':visible') && that.$buttonElement.parents('.is-postcode-lookup').hasClass('parsley-success')) {
                if (keycode == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    that.postCodeLookup();
                }
            }
        });

        $countryElement.on('change', function (e) {
            e.preventDefault();
            that.$formMaster.parsley().destroy();
            // Optional toggles commented out for UX variations
            if ($countryElement.find(":selected").val() === "uk") {
                if (!$countryElement.hasClass('is-optional')) {
                    that.$postcodeElement.attr('data-parsley-excluded', 'false');
                    that.$postcodeElement.attr('data-parsley-required', 'true');
                    that.$postcodeElement.attr('aria-required', 'true');
                }
                that.$postcodeElement.attr('data-parsley-pattern', '^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');
                that.$labelElement.empty().text('Postcode');
                that.$buttonElement.show();
            } else {
                that.$postcodeElement.attr('data-parsley-excluded', 'true');
                that.$postcodeElement.attr('data-parsley-required', 'false');
                that.$postcodeElement.attr('aria-required', 'false');
                that.$postcodeElement.attr('data-parsley-pattern', '((?![.]{2}).)*');
                that.$labelElement.empty().text('Postal code');
                that.$buttonElement.hide();
            }

            that.$postcodeElement.val('');
            that.$formMaster.parsley().refresh();
            that.$postcodeElement.trigger('input').focus().blur();
            that.$listboxElement.parent('.f-forms__element').addClass('hidden');

            $("html, body").animate({
                scrollTop:
                    that.$postcodeElement.offset().top - 100
            }, 300);
        });
    }

    postCodeLookup(): void {
        const _self = this;

        var $formPostcode = $('.f-forms__element--postcode');
        var $searchTerm = (<any>$formPostcode.val()).trim().replace(/\s+/g, '').toUpperCase();
        var $url = $formPostcode.data('url') + $searchTerm;

        axios.get($url)
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    handlePostcodeLookupError();
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                    handlePostcodeLookupError();
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                    handlePostcodeLookupError();
                }
                console.log(error.config);
                handlePostcodeLookupError();
            })

            .then((response) => {
                // SUCCESS 

                //console.log('success');
                fillAddressInputs(response, $searchTerm);

                $("html, body").animate({
                    scrollTop:
                        _self.$postcodeElement.offset().top - 100
                }, 300);
            });


        function fillAddressInputs(response: any, $searchTerm: any) {

            $('.f-forms__listbox').find('li').empty();
            var $formAddress1 = $('.f-forms__element--address1');
            var $formAddress2 = $('.f-forms__element--address2');
            var $formCity = $('.f-forms__element--city');
            var $formCounty = $('.f-forms__element--county');
            var $formCountry = $('.f-forms__element--country');

            $.map(response.data, function (key, value) {

                if (key.PostalCode !== undefined) {
                    var $searchData = key.PostalCode.trim().replace(/\s+/g, '').toUpperCase();
                }

                var $resultFragment = $('<a href="#">').attr('data-address-1', key.Line1).attr('data-address-2', key.Line2).attr('data-city', key.City).attr('data-province', key.Province).text(key.Line1 + ' ' + key.Line2 + ' ' + key.City + ' ' + key.Province + ' ' + key.PostalCode);

                var $failFragmentMsg = $formPostcode.data('urlError');
                var $failFragment = '<li><span>' + $failFragmentMsg + '</span></li>';

                if ($searchTerm == $searchData) {

                    $('.f-forms__listbox').parent('.f-forms__element').removeClass('hidden');
                    $('.f-forms__listbox').find('ul').append($resultFragment.wrap('<li>').parent());

                    $('.f-forms__listbox').find('a').on('click', function () {
                        var selectedAddress1 = $(this).attr('data-address-1');
                        var selectedAddress2 = $(this).attr('data-address-2');
                        var selectedCity = $(this).attr('data-city');
                        var selectedProvince = $(this).attr('data-province');
                        $formAddress1.val(selectedAddress1).focus().blur();
                        $formAddress2.val(selectedAddress2).focus().blur();
                        $formCity.val(selectedCity).focus().blur();
                        $formCounty.val(selectedProvince).focus().blur();

                        $('.f-forms__listbox').parent('.f-forms__element').addClass('hidden');
                    });

                }

                else if ($searchTerm !== $searchData) {
                    $('.f-forms__listbox').parent('.f-forms__element').removeClass('hidden');
                    $('.f-forms__listbox').find('ul').html($failFragment);
                }
            });


            $formCountry.val('uk').focus().blur();
        }

        function handlePostcodeLookupError() {
            var that = this;
            var $errorFragmentMsg = $formPostcode.data('apiError');
            var $errorFragment = '<li><span>' + $errorFragmentMsg + '</span></li>';
            that.$listboxElement.parent('.f-forms__element').removeClass('hidden');
            that.$listboxElement.find('ul').html($errorFragment);
        }
    }
}

$(() => {
    let PostcodeComponentHolder = '.f-forms__postcode-lookup';

    $(PostcodeComponentHolder).each(function (): void {
        let postcodeComponent: any = new PostcodeComponent($(this));
    });
});