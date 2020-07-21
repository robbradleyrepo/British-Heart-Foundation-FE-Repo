/*
* MVC FORMS v2 [EXCLUSIVE] - Validation = Parsley.js dependent

  Note: Until Parsley is supported within Typescript, all core FORM functionality here.

*/

$(document).ready(function() {

    // CORE

    var FormComponent = (function () {
        
        function FormComponent(theComponentSelector) {
            this.componentSelector = theComponentSelector;
            this.initFormComponent();
        }

        FormComponent.prototype.initFormComponent = function () {
            this.setClasses(this.componentSelector);
            this.clearForm(this.componentSelector);
            this.textAreaResize(this.componentSelector);
            this.formSubmit(this.componentSelector);
        };

        FormComponent.prototype.setClasses = function (componentSelector) {
            var $_self = $(componentSelector);
            var $formMaster = $_self;
            var $formActual = $_self.find('form');
            var $formElementActual = $_self.find('.f-forms__element--actual'); 
        };

        FormComponent.prototype.clearForm = function (componentSelector) {
            var $_self = $(componentSelector);
            var $clearControl = $_self.find('.f-forms__clear');
            var $formActual = $_self.find('form');
            var $parsleyNotice = $_self.find('.f-forms__validation--notice');

            $clearControl.on('click', function (e) {
                e.preventDefault();
                $formActual.trigger('reset');
                $formActual.parsley().reset();
                $parsleyNotice.addClass('hidden');
                $formActual.find('.nested').addClass('hidden'); 
                
                $("html, body").animate({ scrollTop: 
                    $formActual.offset().top - 100 
                }, 400);
            });
        };

        FormComponent.prototype.textAreaResize = function (componentSelector) {
            var $_self = $(componentSelector);
            var $formElementTextArea = $_self.find('textarea.f-forms__element--actual'); 

            $formElementTextArea.each(function(){
                autosize(this);
                
                $(this).keyup(function() {
    
                    var text_max = $(this).attr('maxlength'); 
                    var text_length = $(this).val().length; 
                    var text_remaining = text_max - text_length;
        
                    $(this).siblings('.f-forms__textarea--chars').html(text_remaining);
                });
            });
            
        };

        FormComponent.prototype.formSubmit = function (componentSelector) {
            var $_self = $(componentSelector);
            var $formActual = $_self.find('form');
            var $parsleyNotice = $_self.find('.f-forms__validation--notice');
            var $btn_notice = $_self.find('.f-forms__button--notice');
            var $notice = $_self.find('.f-forms__notice');
            
            
            /* CORE Parsley */
            $formActual.parsley()
            .on('field:success', function() {
                var ok = $('.parsley-error').length === 0;
                if (!ok) {
                    $parsleyNotice.removeClass('hidden');
                } else {
                    $parsleyNotice.addClass('hidden'); 
                }
            })
            .on('form:validated', function() {
                var ok = $('.parsley-error').length === 0;
                if (!ok) {
                    $parsleyNotice.removeClass('hidden');
                    $("html, body").animate({ scrollTop: 
                        $formActual.find('.parsley-error').offset().top - 100 
                    }, 400);
                } else {
                    $parsleyNotice.addClass('hidden'); 
                }
            })
            .on('form:submit', function() {
                if ($btn_notice.length) { 
                    $btn_notice.addClass('deactive');
                    $notice.removeClass('hidden');
                }
                return true;
            });
            
        };
 
        return FormComponent;
    }());

    $(function () {
        var FormComponentHolder = '.f-forms-parsley';

        $(FormComponentHolder).each(function () {
            new FormComponent($(this));
        });
    });


    // EXIT FORM

    var ExitFormComponent = (function () {
        
        function ExitFormComponent(theComponentSelector) {
            this.componentSelector = theComponentSelector;
            this.initExitFormComponent();
        }

        ExitFormComponent.prototype.initExitFormComponent = function () {
            this.cancelForm(this.componentSelector); 
        };

        ExitFormComponent.prototype.cancelForm = function (componentSelector) {
            var $_self = $(componentSelector);
           
            var $cta_href = $_self.find('.cta__href');

            $cta_href.on('click', function (e) {
                $.modal.close();
                $('form').parsley.reset();
                var url = $(this).attr('href');
                window.location.href = url;
            });

            $('#f-modal__close').on($.modal.OPEN, function(event, modal) {
                $('input, select, textarea').each(function(e) {
                    $(this).prop('disabled', true);
                }); 
            });

            $('#f-modal__close').on($.modal.CLOSE, function(event, modal) {
                $('input, select, textarea').each(function(e) {
                    $(this).prop('disabled', false);
                }); 
            });
        };
 
        return ExitFormComponent;
    }());

    $(function () {
        var ExitFormComponentHolder = '.f-header';

        $(ExitFormComponentHolder).each(function () {
           new ExitFormComponent($(this)); 
        });
    });


    // NESTED TOGGLE

    var NestedComponent = (function () {
        
        function NestedComponent(theComponentSelector) {
            this.componentSelector = theComponentSelector;
            this.toggleNestedComponent();
        }

        NestedComponent.prototype.toggleNestedComponent = function () {
            this.toggleComponent(this.componentSelector);
        };

        NestedComponent.prototype.toggleComponent = function (componentSelector) {
            var $_self = $(componentSelector);
            
            $_radio_control = $('form').find('.f-forms__fieldset--nested').children('.f-forms__element').children('.f-forms__radio').children('.f-forms__radio--element');

            // IF CHECKBOX with INPUT or TEXTAREA
            if ($_self.is('input[type=checkbox]')) { 
                
                $_self.on('click', function() {
 
                    if ($(this).prop('checked') ) {
                        $(this).closest('.f-forms__element').find('.nested').removeClass('hidden'); 
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').attr('data-parsley-required','true');
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').attr('data-parsley-excluded','false');
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').attr('aria-required','true');
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').attr('data-parsley-validate-if-empty', '');
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').focus();
                    }
        
                    else { 
                        $(this).closest('.f-forms__element').find('.nested').addClass('hidden'); 
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').attr('data-parsley-required','false');
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').attr('data-parsley-excluded','true');
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').attr('aria-required','false');
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').val('');
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').removeAttr('data-parsley-validate-if-empty');
                        $(this).closest('.f-forms__element').find('.nested').children('input, textarea').parsley().reset();
                    }
                });
            }

            // IF RADIO with INPUT or TEXTAREA but NOT RADIO
            else if ($_self.is('[type=radio]') && $_self.hasClass('is-nested-input')) { 

                $_radio_control.on('click', function() {

                    if ( $_self.is(':checked') == true ) {
                        $(this).closest('.f-forms__radio').siblings('.nested').removeClass('hidden'); 
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input, textarea').attr('data-parsley-required','true');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input, textarea').attr('data-parsley-excluded','false');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input, textarea').attr('aria-required','true');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input, textarea').focus();
                    }
    
                    else if ( $_self.not(':checked') ) { 
                        $(this).closest('.f-forms__radio').siblings('.nested').addClass('hidden'); 
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input, textarea').attr('data-parsley-required','false');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input, textarea').attr('data-parsley-excluded','true');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input, textarea').attr('aria-required','false');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input, textarea').val('');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input, textarea').parsley().reset();
                    }
                });
            }
            
            // IF RADIO with RADIO
            else if ($_self.is('[type=radio]') && $_self.hasClass('is-nested-radio')) { 

                $_radio_control.on('click', function() {

                    if ( $_self.is(':checked') == true ) {
                        $(this).closest('.f-forms__radio').siblings('.nested').removeClass('hidden'); 
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input[type=radio]').attr('data-parsley-required','true');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input[type=radio]').attr('data-parsley-excluded','false');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input[type=radio]').attr('aria-required','true');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input').parsley();
                    }
    
                    else if ( $_self.not(':checked') ) { 
                        $(this).closest('.f-forms__radio').siblings('.nested').addClass('hidden'); 
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input[type=radio]').attr('data-parsley-required','false');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input[type=radio]').attr('data-parsley-excluded','true');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input[type=radio]').attr('aria-required','false');
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input[type=radio]').prop('checked', false);
                        $(this).closest('.f-forms__radio').siblings('.nested').find('input:first').parsley().destroy();
                    }
                    
                });
            }

            // IF RADIO with NESTED CHECKBOX (giftaid only)
            else if ($_self.is('[type=radio]') && $_self.hasClass('is-giftaid')) { 
                
                $_radio_control.on('click', function() {

                    if ( $_self.is(':checked') == true ) {
                        $(this).closest('.f-forms__radio').siblings('.f-forms__giftaid--nested').removeClass('hidden'); 
                    }
    
                    else if ( $_self.not(':checked') ) { 
                        $(this).closest('.f-forms__radio').siblings('.f-forms__giftaid--nested').addClass('hidden'); 
                        $(this).closest('.f-forms__radio').siblings('.f-forms__giftaid--nested').find('input').prop('checked', false);
                    }
                    
                });
            }
            
        };
 
        return NestedComponent;
    }());

    $(function () {
        var NestedComponentHolder = '.f-forms__element--parsley-toggle';

        $(NestedComponentHolder).each(function () {
           new NestedComponent($(this));
        });
    });

    // TOGGLE MICROFORM

    var MicroFormComponent = (function () {
        
        function MicroFormComponent(theComponentSelector) {
            this.componentSelector = theComponentSelector;
            this.initMicroFormComponent();
        }

        MicroFormComponent.prototype.initMicroFormComponent = function () {
            this.toggleMicroForm(this.componentSelector); 
        };

        MicroFormComponent.prototype.toggleMicroForm = function (componentSelector) {
            var $_self = $(componentSelector);
            var $microform_control = $_self.siblings('.f-forms--microform__control');
            
            $(componentSelector).find('.f-forms__element--optional-flag').remove();

            $microform_control.on('click', function (e) {
                e.preventDefault();
                $_self.toggleClass('hidden');

                if ($_self.hasClass('hidden')) {
                    $_self.find('input').attr('data-parsley-required','false');
                    $_self.find('input').attr('data-parsley-excluded','true');
                    $_self.find('input').attr('aria-required','false');
                    $_self.find('input').val('');
                    $_self.find('input').removeAttr('data-parsley-validate-if-empty');
                } else {
                    $_self.find('input').attr('data-parsley-required','true');
                    $_self.find('input').attr('data-parsley-excluded','false');
                    $_self.find('input').attr('aria-required','true');
                    $_self.find('input').attr('data-parsley-validate-if-empty', '');
                }

                $('form').parsley().refresh();
            });
        }; 
 
        return MicroFormComponent;
    }());

    $(function () {
        var MicroFormComponentHolder = '.f-forms--microform';

        $(MicroFormComponentHolder).each(function () {
           new MicroFormComponent($(this)); 
        });
    });



}); // Document ready end
