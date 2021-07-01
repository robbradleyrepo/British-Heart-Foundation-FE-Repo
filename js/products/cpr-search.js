/*
* MVC - CPR search - Custom JS
*/

$(document).ready(function() {

    
    // GLOBALS
    var $searchForm = $('#g-forms__product-cpr__search');

    if ($searchForm.length) {
		
		//Ensure API data is in cache by making an initial call to it..
        var serviceIsReadyResult = $.ajax({
            url: "/api/schools/getschools?query=NW1",
        });

        // SPECIFIC
        var $searchBox = $searchForm.find('#g-forms__product-cpr__searchbox');
        var $searchButton = $searchForm.find('.cta');

        // apply z-index to shelf below
        $searchForm.parents('.cs-shelf__row').next('.cs-shelf__row').addClass('negative-z');
        
        var $url = '/api/schools/getschools'
        
        var options = {
            url: function(phrase) {
				$('#SchoolId').val(0);
				$('#SearchQuery').val(phrase);
                return $url + "?query=" + phrase + "&format=json";
            },
            adjustWidth: false,
            requestDelay: 200,
            minCharNumber: 3, 
            getValue: function (element) { 

                return $(element).prop("EstablishmentName") + "<i>" + $(element).prop("County") + " " + $(element).prop("Postcode") + "</i>" 
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
					$('#SchoolId').val($searchBox.getSelectedItemData().Id);
                    var $selectedName = $searchBox.getSelectedItemData().EstablishmentName;
                    var $selectedCounty = $searchBox.getSelectedItemData().County;
					var $selectedTown = $searchBox.getSelectedItemData().Town;
                    var $selectedPostcode = $searchBox.getSelectedItemData().Postcode;
                    var $newvalue = $selectedName;
					if  ($selectedCounty){
						$newvalue += ', ' + $selectedCounty
					}else if($selectedTown){
						$newvalue += ', ' + $selectedTown
					}
					if  ($selectedPostcode){
						$newvalue += ', ' + $selectedPostcode
					}
					$('#SearchQuery').val($newvalue);
                    $searchBox.val($newvalue);
                },
				onShowListEvent: function () {
					$searchBox.removeClass('is-visible');
                },
				onHideListEvent: function () {
					$searchBox.removeClass('is-visible');
                },
                showAnimation: {
                    type: "fade", 
                    time: 300,
                    callback: function() {}
                },
                hideAnimation: {
                    type: "slide",
                    time: 200,
                    callback: function() {}
                },
                maxNumberOfElements: 10,
                match: {
                    enabled: true
                }
            },
			preparePostData: function(data) {
				if (serviceIsReadyResult.status != 200){
					$searchBox.addClass('is-visible');		
				}
				return data;
			}
        };
        
        $searchBox.easyAutocomplete(options); 
        
        $searchButton.appendTo('.easy-autocomplete');
        

    }

}); // Document ready end 