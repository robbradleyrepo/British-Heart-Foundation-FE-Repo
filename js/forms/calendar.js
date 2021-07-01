$(document).ready(function() {

    var FormDateComponent = (function () {
        
        function FormDateComponent(theComponentSelector) {
            this.componentSelector = theComponentSelector;
            this.initFormDateComponent();
        };

        FormDateComponent.prototype.initFormDateComponent = function () {
            this.setInput(this.componentSelector);
            this.detectFieldFocus(this.componentSelector);
            this.addCustomValidator(this.componentSelector);
            this.validateOnload(this.componentSelector);
        };

        FormDateComponent.prototype.validateField = function ($inputFields, $currentField) {
            $inputFields.each(function() {
                if ($(this).attr('id') !== $currentField.attr('id')) {
                    if ($(this).parsley().isValid() === false) {
                        $(this).parsley().validate();
                        return false;
                    }
                }
            });
        };

        FormDateComponent.prototype.setCustomDateFieldValue = function ($inputFields, $customField, componentSelector) {
            var isAllFieldsValid = true;
            var isExcluded = false;
            var that = this;
            var $_self = $(componentSelector);
            var allowPastDate = $_self.attr('data-past-date');
            var allowFutureDate = $_self.attr('data-future-date');

            $inputFields.each(function() {
                if ($(this).parsley().isValid() === false) {
                    isAllFieldsValid = false;
                    return false;
                }
                if (!that.checkExcludedDate(componentSelector)) {
                    isExcluded = true;
                    isAllFieldsValid = false;
                    return false;
                }
            });

            if (isAllFieldsValid === true && allowPastDate === "false" && that.getDateStatus(componentSelector, "past") === false) {
                isAllFieldsValid = false;
                $inputFields.eq(0).focus();
                $customField.parsley().validate();
            }
            else if (isAllFieldsValid === true && allowFutureDate === "false" && that.getDateStatus(componentSelector, "future") === false) {
                isAllFieldsValid = false;
                $inputFields.eq(0).focus();
                $customField.parsley().validate();
            }

            if (isExcluded === true) {
                $customField.attr("data-parsley-excluded-date", 'true');
                $customField.parsley().validate();
            } 
            else {
                $customField.attr("data-parsley-excluded-date", 'false');
                $customField.parsley().validate();
            }

            if (isAllFieldsValid === true) {
                if (that.isOptional(componentSelector) === false) {
                    if (that.isOptional(componentSelector) === false && that.isAnyDateFieldsEmpty(componentSelector) === true) {
                        $customField.attr("data-parsley-is-date-valid", 'false');
                        $customField.parsley().validate();
                    }
                    else {
                        $customField.attr("data-parsley-is-date-valid", 'true');
                        $customField.parsley().validate();
                    }
                }
            }
            else {
                $customField.attr("data-parsley-is-date-valid", 'false');
                $customField.parsley().validate();
            }
        };

        FormDateComponent.prototype.checkExcludedDate = function (componentSelector) {
            var $_self = $(componentSelector);
            if ($_self.hasClass('f-forms--calendar-picker') && $('.calendar-trigger').datepicker('getDate') !== null) {
                var day = $('.calendar-trigger').datepicker('getDate').getDate();
                var calendarDay = $('.ui-datepicker-calendar').find('span').filter(function() { return ($(this).text() == day) });
                if (calendarDay.length > 0) {
                    calendarDay = calendarDay[0].closest('td');
                    if ($(calendarDay).hasClass('ui-datepicker-unselectable')) {
                        return false;
                    }
                } else {
                    return true;
                }
            }
            return true;
        };

        FormDateComponent.prototype.detectFieldFocus = function (componentSelector) {
            var $_self = $(componentSelector);
            var that = this;
            var $inputFields = $_self.find('input[type=text]');
            var $elementError = $_self.find('.f-forms__element--error');
            var $customField = $_self.find('[data-parsley-is-date-valid]');
            var prevFocus;
            var timer;
    
            $inputFields.each(function() {
                $(this).on("focusout", function() {
                    var $currentField = $(this);
                    var getDays = that.getDays($inputFields);

                    if (getDays !== false) {
                        $inputFields.eq(0).attr("data-parsley-range", '[1,'+getDays+']');
                        $inputFields.eq(0).attr("data-parsley-range-message", 'Day must be a number between 1 and '+getDays);
                    }

                    timer = setTimeout( function() {
                        that.setCustomDateFieldValue($inputFields, $customField, componentSelector);

                        if ($currentField.parsley().isValid() === true) {
                            that.validateField($inputFields, $currentField);
                            $elementError.find('ul.filled').removeClass('hidden');
                            $elementError.attr("data-date-fields-all", 'true');
                        }
                        else {
                            $elementError.attr("data-date-fields-all", 'false');
                            $elementError.find('ul.filled').removeClass('hidden');
                            $elementError.find('ul.filled').not('#parsley-id-'+$currentField.data('parsleyId')).addClass('hidden');
                        }

                        $elementError.removeClass("hidden");
                        prevFocus = undefined;
                    }, 100);
                    
                    $(this).closest('.f-forms__date').find('.f-forms__label, label').removeClass("focus");

                }).on("focus", function() {
                    if (typeof prevFocus  !== "undefined") {
                        $elementError.addClass("hidden");
                    }

                    clearTimeout(timer);
                    prevFocus = $(this);
                    $(this).closest('.f-forms__date').find('.f-forms__label, label').addClass("focus");

                }).on('keyup', function() {
                    if ($(this).val().toString().length > 1) {
                        $(this).parent().next('.f-forms__textbox').find('input[type=text]').focus();
                    }
                });
            });
        };

        FormDateComponent.prototype.setInput = function (componentSelector) {
            var $_self = $(componentSelector);
            var $formActual = $_self.closest('form');
            var allowPastDate = $_self.attr('data-past-date');
            var allowFutureDate = $_self.attr('data-future-date');
            var $formElement = $_self.find('.f-forms__element');

            if (allowPastDate === "false") {
                $formElement.attr("data-parsley-past-date", "false");
            }
            else if (allowFutureDate === "false") {
                $formElement.attr("data-parsley-future-date", "false");
            }

            $($formActual).parsley({
                inputs: Parsley.options.inputs + ',[data-parsley-is-date-valid]'
            });
        };

        FormDateComponent.prototype.isLeapYear = function (year) {
            var Last2Digits = year % 100;
            var flag;

            if (Last2Digits == 0) {
                flag = year % 400
            } 
            else {
                flag = year % 4
            }
            return flag == 0;
        }

        FormDateComponent.prototype.getDateStatus = function (componentSelector, dateType) {
            var $_self = $(componentSelector);
            var $inputFields = $_self.find('input[type=text]');
            var todayDate = new Date();
            var givenInputDate;
            var inputDate = '';
            var allowTodayDate = $_self.attr('data-include-today');
            var allowPastDate = $_self.attr('data-past-date');
            var allowFutureDate = $_self.attr('data-future-date');
            todayDate.setHours(0,0,0,0)

            $($inputFields.get().reverse()).each(function(index) {
                if ($(this).parsley().isValid() === false) {
                    return 'invalid-date';
                }
                else {
                    if (($inputFields.length - 1) === index) {
                        if ($(this).val().length > 1) {
                            inputDate+= $(this).val();
                        }
                        else {
                            inputDate+= '0'+$(this).val();
                        }
                    }
                    else {
                        if ($(this).val().length > 1) {
                            inputDate+= $(this).val()+'-';
                        }
                        else {
                            inputDate+= '0'+$(this).val()+'-';
                        }
                    }
                }
            });

            givenInputDate = new Date(inputDate);

            if (allowTodayDate === "false" && allowPastDate === "false") {
                todayDate.setDate(todayDate.getDate() + 1);
            }
            else if (allowTodayDate === "false" && allowFutureDate === "false") {
                todayDate.setDate(todayDate.getDate() - 1);
            }

            if (dateType === "future") {
                if (givenInputDate.getTime() <= todayDate.getTime()) {
                    return true;
                }
                return false;
            }
            else if (dateType === "past") {
                if (givenInputDate.getTime() >= todayDate.getTime()) {
                    return true;
                }
                return false;
            }
        }

        FormDateComponent.prototype.getDays = function ($inputFields) {
            var days = 31;

            if ($inputFields.eq(1).parsley().isValid() === true && $inputFields.eq(2).parsley().isValid() === true) {
                var month = parseInt($inputFields.eq(1).val()); 
                var year = parseInt($inputFields.eq(2).val());
            
                switch (month) {
                    case 2:
                        days = (this.isLeapYear(year)) ? 29 : 28;
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        days = 30;
                        break;
                }
                return days;
            }
            return false;
        }

        FormDateComponent.prototype.validateDateFields = function (componentSelector) {
            var $_self = $(componentSelector);
            var $inputFields = $_self.find('input[type=text]');
            var ValidFields = true;

            $inputFields.each(function() {
                if ($(this).parsley().isValid() === false) {
                    ValidFields = false;
                    return false;
                }
            });

            return ValidFields;
        }

        FormDateComponent.prototype.validateOnload = function (componentSelector) {
            var $_self = $(componentSelector);
            var $inputFields = $_self.find('input[type=text]');
            var isInputEmpty = false;

            $inputFields.each(function() {
                if ($.trim($(this).val()) == "") {
                    isInputEmpty = true;
                }
            });

            if (isInputEmpty === false) {
                $inputFields.eq(0).focus().focusout();
            }
        };

        FormDateComponent.prototype.isAnyDateFieldsEmpty = function (componentSelector) {
            var $_self = $(componentSelector);
            var $inputFields = $_self.find('input[type=text]');

            if ($.trim($inputFields.eq(0).val()) !== "" && $.trim($inputFields.eq(1).val()) !== "" && $.trim($inputFields.eq(2).val() !== "")) {
                return false;
            }

            return true;
        }

        FormDateComponent.prototype.isDateEmpty = function (componentSelector) {
            var $_self = $(componentSelector);
            var $inputFields = $_self.find('input[type=text]');
            var isEmpty = true;

            $inputFields.each(function() {
                if ($.trim($(this).val()) !== "") {
                    isEmpty = false;
                }
            });

            if (isEmpty === false) {
                $inputFields.eq(0).attr("data-parsley-required", "true");
                $inputFields.eq(1).attr("data-parsley-required", "true");
                $inputFields.eq(2).attr("data-parsley-required", "true");
            }
            else {
                $inputFields.eq(0).attr("data-parsley-required", "false");
                $inputFields.eq(1).attr("data-parsley-required", "false");
                $inputFields.eq(2).attr("data-parsley-required", "false");
            }

            return isEmpty;
        }

        FormDateComponent.prototype.isOptional = function (componentSelector) {
            var $_self = $(componentSelector);
            var datePickerRequired = $_self.find('[data-calendar-picker-required]').data('calendar-picker-required');
            var enableCustomValidation = datePickerRequired === undefined ? true : datePickerRequired;

            if (enableCustomValidation === false && this.isDateEmpty(componentSelector) === true) {
                return true;
            }

            return false;
        }

        FormDateComponent.prototype.addCustomValidator = function (componentSelector) {
            var that = this;
            var $_self = $(componentSelector);
            var $form = $_self.closest('form');
            var $customField = $_self.find('[data-parsley-is-date-valid]');
            var futureDateMsg = $_self.attr('data-future-date-message');
            var pastDateMsg = $_self.attr('data-past-date-message');
            var genericDateMsg = $_self.attr('data-generic-date-message');
            var excludeDateMsg = $_self.attr('data-exclude-date-message');

            Parsley.addValidator('isDateValid', {
                messages: {
                  en: genericDateMsg
                },
                validate: function(value, requirement, instance) {
                    
                    if (that.isOptional(componentSelector) === true) {
                        return true;
                    }

                    if (that.isOptional(componentSelector) === false && that.isAnyDateFieldsEmpty(componentSelector) === true) {
                        return false
                    }

                    if (requirement === true) {
                        return true;
                    }

                    return false;
                },
                priority: 1
            });

            Parsley.addValidator('excludedDate', {
                messages: {
                  en: excludeDateMsg
                },
                validate: function(value, requirement, instance) {
                    if (that.isOptional(componentSelector) === true) {
                        return true;
                    }

                    if (requirement === true) {
                        return false;
                    }

                    return true;
                },
                priority: 3
            });

            Parsley.addValidator('futureDate', {
                messages: {
                  en: futureDateMsg
                },
                validate: function(value, requirement, instance) {
                    var isDateValid = that.getDateStatus(componentSelector, "future");

                    if (that.isOptional(componentSelector) === true) {
                        return true;
                    }

                    if (that.validateDateFields(componentSelector) === true && isDateValid === false) {
                        return false;
                    }

                    return true;
                },
                priority: 2
            });

            Parsley.addValidator('pastDate', {
                messages: {
                  en: pastDateMsg
                },
                validate: function(value, requirement, instance) {
                    var isDateValid = that.getDateStatus(componentSelector, "past");

                    if (that.isOptional(componentSelector) === true) {
                        return true;
                    }
                    
                    if (that.validateDateFields(componentSelector) === true && isDateValid === false) {
                        return false;
                    }

                    return true;
                },
                priority: 2
            });

            $form.parsley().on('form:validated', function() {
                $customField.parsley().validate();
            });
        };

        return FormDateComponent;
    }());

    $(function () {
        var FormDateComponentHolder = '.f-forms--calendar-picker';
        $(FormDateComponentHolder).each(function () {
            new FormDateComponent($(this));
        });
    });
});