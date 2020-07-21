/*
* MVC FORMS v2 [EXCLUSIVE] - Just Giving

  Dependency: Parsley, JG API

*/

$(document).ready(function() {

    // EXIT FORM

    var JustGivingComponent = (function () {
        
        function JustGivingComponent(theComponentSelector) {
            this.componentSelector = theComponentSelector;
            this.initJustGiving();
        }

        JustGivingComponent.prototype.initJustGiving = function () {
            this.API__email(this.componentSelector);
        }; 

        JustGivingComponent.prototype.API__email = function (componentSelector) {
            var $_self = $(componentSelector);
            var $msg = $_self.data('error');

            window.Parsley.addAsyncValidator('justgiving-api', function (xhr) {

                if ( 200 === xhr.status ) {
                    console.log(xhr.status); 
                    this.addError("remote", { message: $msg, updateClass: true});
                }
                else {
                    this.removeError("remote", {updateClass: true}); 
                }
                
                return 500 === xhr.status;  
                    
            }); 
        };
 
        return JustGivingComponent;
    }());

    $(function () {
        var JustGivingComponentHolder = '.f-forms--justgiving-email';

        $(JustGivingComponentHolder).each(function () {
           new JustGivingComponent($(this)); 
        });
    });
 

}); // Document ready end
