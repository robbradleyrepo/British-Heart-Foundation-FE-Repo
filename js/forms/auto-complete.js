/*
* MVC FORMS v2 - Autocomplete = EasyAutocomplete.js dependent

  Note: The plugin (EasyAutocomplete) does not support scrollbar out of the box, in any IE when the 
  autocomplete scrollbar has been clicked the pop-up disappears. To fix this IE-specific issue, it detects 
  if the browser is IE then applies the focus to the input element.

*/

$(document).ready(function() {

    var AutoCompleteComponent = (function () {
        
        function AutoCompleteComponent(theComponentSelector) {
            this.componentSelector = theComponentSelector;
            this.initAutoCompleteComponent();
            this.scrollState = false;
        };

        AutoCompleteComponent.prototype.initAutoCompleteComponent = function () {
            this.getOptions(this.componentSelector);
            this.isScroll(this.componentSelector);
        };

        AutoCompleteComponent.prototype.getOptions = function (componentSelector) {
            var $_self = $(componentSelector);
            var $searchBox = $_self.find('input[type=text]');
            var $url = $searchBox.data('autocompleteUrl');
            var $defaultQuery = $searchBox.data('autocompleteQuery');
            var $displayValue = $.trim($searchBox.data('autocompleteDisplay')).split(" ");
            var $valueToSelect = $.trim($searchBox.data('autocompleteSelect')).split(" ");
            
            this.setOptions($url, $displayValue, $defaultQuery, $valueToSelect, componentSelector, $searchBox);
        };

        AutoCompleteComponent.prototype.isScroll = function (componentSelector) {
            var autoCompleteComponent = this;
            var $_self = $(componentSelector);

            $_self.find('.easy-autocomplete-container ul').on("scroll", function (e) {
                autoCompleteComponent.scrollState = true;
            });
        };

        AutoCompleteComponent.prototype.selectedText = function (valueToSelect, searchBox) {
            var autoCompleteComponent = this;
            var $searchBox = $(searchBox);
            var strSelectedValue = '';
            autoCompleteComponent.scrollState = false;

            if (valueToSelect.length === 1) {
                strSelectedValue = $searchBox.getSelectedItemData()[valueToSelect[0]];
            }
            else {
                $.each (valueToSelect, function(i, val) {
                    if (i === 0) {                       
                        strSelectedValue += $searchBox.getSelectedItemData()[val];
                    }
                    else {
                        strSelectedValue += ', ' +$searchBox.getSelectedItemData()[val];
                    }
                });
            }

            return strSelectedValue;
        };

        AutoCompleteComponent.prototype.setOptions = function (url, displayValue, defaultQuery, valueToSelect, componentSelector, searchBox) {          
            var $_self = $(componentSelector);
            var $searchBox = $(searchBox);
            var autoCompleteComponent = this;
            
            if ($_self.length) {
                var serviceIsReadyResult = $.ajax({
                    url: url + "?query="+ defaultQuery,
                    url: url,
                });

                var $searchButton = $_self.find('.cta');
                
                var options = {
                    url: function(phrase) {
                        return url + "?query=" + phrase + "&format=json";
                    },
                    adjustWidth: false,
                    requestDelay: 200,
                    minCharNumber: 3, 
                    getValue: function (element) { 
                        var strDisplayVal = '';

                        if (displayValue.length === 1) {
                            strDisplayVal = element[displayValue[0]];
                        }
                        else {
                            $.each(displayValue, function(i,val) {
                                if (i === 0) {
                                    strDisplayVal += element[val];
                                }
                                else {
                                    strDisplayVal += ' <i>' +element[val]+ '</i>';
                                }
                            });
                        }
                        
                        return strDisplayVal;
                    },
                    requestDelay: 300,
                    template: {
                        type: "custom",
                        method: function(value, item) {
                            return value;
                        }
                    },
                    list: {
                        onSelectItemEvent: function() { 
                            var selectedText = autoCompleteComponent.selectedText(valueToSelect, searchBox);
                            $searchBox.attr("data-parsley-pattern", selectedText);
                            $searchBox.val(selectedText);
                        },
                        onChooseEvent: function() {
                            $searchBox.val(autoCompleteComponent.selectedText(valueToSelect, searchBox));
                        },
                        onShowListEvent: function () {
                            $searchBox.removeClass('is-visible');
                            autoCompleteComponent.scrollState = false;
                        },
                        onHideListEvent: function () {
                            $searchBox.removeClass('is-visible');
                        },
                        showAnimation: {
                            type: "fade", 
                            time: 0,
                            callback: function() {}
                        },
                        hideAnimation: {
                            type: "slide",
                            time: 0,
                            callback: function() {
                                if (autoCompleteComponent.scrollState === true && (document.documentMode || /Edge/.test(navigator.userAgent))) {
                                    autoCompleteComponent.scrollState = false;
                                    $searchBox.focus();
                                }
                            }
                        },
                        maxNumberOfElements: 10,
                        match: {
                            enabled: true
                        }
                    },
                    preparePostData: function(data) {
                        if (serviceIsReadyResult.status != 200) {
                            $searchBox.addClass('is-visible');		
                        }

                        return data;
                    }
                };
                
                $searchBox.easyAutocomplete(options); 
                $searchButton.removeClass("hidden").appendTo('.easy-autocomplete');
            }
        }

        return AutoCompleteComponent;
    }());

    $(function () {
        var autoCompleteHolder = '.f-forms--autocomplete';

        $(autoCompleteHolder).each(function () {
            new AutoCompleteComponent($(this));
        });
    });
});