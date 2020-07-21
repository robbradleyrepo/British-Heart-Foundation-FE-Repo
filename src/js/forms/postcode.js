/*
* MVC FORMS v2 [EXCLUSIVE] - Postcode Lookup = Parsley.js dependent

  Note: Until Parsley is supported within Typescript, all core FORM functionality here.

*/

$(document).ready(function() {

    // CORE

    var PostcodeComponent = (function () {
        
        function PostcodeComponent(theComponentSelector) {
            this.componentSelector = theComponentSelector;
            this.initPostcodeComponent();
        }

        PostcodeComponent.prototype.initPostcodeComponent = function () {
            this.setClasses(this.componentSelector);
        };

        PostcodeComponent.prototype.setClasses = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $formButton = $_self.find('.is-postcode-button');
            var $formPostcode = $('.f-forms__element--postcode');

            $formPostcode.on('focus', function(e) {
                e.preventDefault();
                e.stopPropagation();
                that.resetElements();
            });

            $formButton.on('click', function(e) { 
                e.preventDefault();
                e.stopPropagation();
                that.callAjaxPostCodeLookup();
            });

            $formPostcode.parsley().on('field:success', function() {  
                $formPostcode.keypress(function (e) {
                    var keycode = (e.keyCode ? e.keyCode : e.which);
                    if (keycode == '13') {
                        e.preventDefault();
                        e.stopPropagation();
                        that.callAjaxPostCodeLookup();
                    }
                });
            });
                
            
        };

        PostcodeComponent.prototype.resetElements = function () {
            var $form = $('.f-forms-parsley');
            var $parsleyAddress1 = $form.find('.f-forms__element--address1');
            var $parsleyAddress2 = $form.find('.f-forms__element--address2');
            var $parsleyAddress3 = $form.find('.f-forms__element--address3');
            var $parsleyCity = $form.find('.f-forms__element--city');
            var $parsleyCounty = $form.find('.f-forms__element--county');

            $parsleyAddress1.val('').parsley().reset();
            $parsleyAddress2.val('').parsley().reset();
            $parsleyAddress3.val('').parsley().reset();
            $parsleyCity.val('').parsley().reset();
            $parsleyCounty.val('').parsley().reset();

            $('.f-forms__listbox').parent('.f-forms__element').addClass('hidden');
            $('.f-forms__listbox').find('li').empty();

        };

        PostcodeComponent.prototype.callAjaxPostCodeLookup = function () {
            var $formPostcode = $('.f-forms__element--postcode');
            var $searchTerm = $('.f-forms__element--postcode').val().trim().replace(/\s+/g, '').toUpperCase();

            /* AJAX */
            
            $.ajax({
                url: $formPostcode.data('url') + $searchTerm,
                //url: "//api.jsonbin.io/b/5bb33aa99353c37b7439fdbe",   
                method: "GET",
                contentType: "application/json; charset=utf-8",
                success:function(result) {
                    fillAddressInputs(result, $searchTerm);
    
                    $("html, body").animate({
                        scrollTop:
                            $formPostcode.offset().top - 100
                    }, 300);
                    
                },
                error:function(result) {
                    handlePostcodeLookupError();
                }
            });

            function fillAddressInputs(result, $searchTerm) {
                $('.f-forms__listbox').find('li').empty();
                var $formAddress1 = $('.f-forms__element--address1');
                var $formAddress2 = $('.f-forms__element--address2');
                var $formCity = $('.f-forms__element--city');
                var $formCounty = $('.f-forms__element--county');

                $.map(result, function(key, value) {

                    if (key.PostalCode !== undefined ) {
                        var $searchData = key.PostalCode.trim().replace(/\s+/g, '').toUpperCase();
                    }

                    var $resultFragment = $('<a href="#">').attr('data-address-1', key.Line1).attr('data-address-2', key.Line2).attr('data-city', key.City).attr('data-province', key.Province).text(key.Line1 + ' ' + key.Line2 +  ' ' + key.City + ' ' + key.Province + ' ' + key.PostalCode);

                    var $failFragmentMsg = $formPostcode.data('urlError');
                    var $failFragment = '<li><span>' + $failFragmentMsg + '</span></li>';
                    
                    if ($searchTerm == $searchData) {

                        $('.f-forms__listbox').parent('.f-forms__element').removeClass('hidden');
                        $('.f-forms__listbox').find('ul').append($resultFragment.wrap('<li>').parent());

                        $('.f-forms__listbox').find('a').on('click', function() {
                            var selectedAddress1 = $(this).attr('data-address-1');
                            var selectedAddress2 = $(this).attr('data-address-2');
                            var selectedCity = $(this).attr('data-city');
                            var selectedProvince = $(this).attr('data-province');    
                            $formAddress1.val( selectedAddress1 ).focus().blur();
                            $formAddress2.val( selectedAddress2 ).focus().blur();
                            $formCity.val( selectedCity ).focus().blur();
                            $formCounty.val( selectedProvince ).focus().blur();
                            
                            $('.f-forms__listbox').parent('.f-forms__element').addClass('hidden');
                        });

                    }

                    else if ($searchTerm !== $searchData) {
                        $('.f-forms__listbox').parent('.f-forms__element').removeClass('hidden');
                        $('.f-forms__listbox').find('ul').html($failFragment);    
                    }
                });
            }

            function handlePostcodeLookupError() {
                var $errorFragmentMsg = $formPostcode.data('apiError');
                var $errorFragment = '<li><span>' + $errorFragmentMsg + '</span></li>';
                $('.f-forms__listbox').parent('.f-forms__element').removeClass('hidden');
                $('.f-forms__listbox').find('ul').html($errorFragment); 
            }
        };

        return PostcodeComponent;
    }());

    $(function () {
        var PostcodeComponentHolder = '.f-forms__postcode-lookup';

        $(PostcodeComponentHolder).each(function () {
            new PostcodeComponent($(this));
        });
    });


}); // Document ready end

/* Forms END */