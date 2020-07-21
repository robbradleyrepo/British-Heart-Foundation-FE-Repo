/*
* MVC FORMS v2 [EXCLUSIVE] - Retail Cash Donations

  Dependency: jQuery Idle, Modal. 

  Timeout functionality.

*/

$(document).ready(function() {

    // EXIT FORM

    var ExitFormComponent = (function () {
        
        function ExitFormComponent(theComponentSelector) {
            this.componentSelector = theComponentSelector;
            this.initExitFormComponent();
        }

        ExitFormComponent.prototype.initExitFormComponent = function () {
            this.timeoutForm(this.componentSelector);
        }; 

        ExitFormComponent.prototype.timeoutForm = function (componentSelector) {
            var $_self = $(componentSelector);
            var $timeout = $_self.data('timeout');
            var $redirect = $_self.data('redirect');
            var $session = $_self.data('session');
            
            $(document).idle({
                onIdle: function(){
                    $('#f-modal__timeout').modal();
                },
                idle: $timeout
            });

            $(document).idle({
                onIdle: function(){
                    $.modal.close();
                    $('form').parsley().reset();
                    window.location.href = ($session.length) ? $session : 'https://www.bhf.org.uk';
                },
                idle: $redirect
            });

        };
 
        return ExitFormComponent;
    }());

    $(function () {
        var ExitFormComponentHolder = '.f-header--timeout';

        $(ExitFormComponentHolder).each(function () {
           new ExitFormComponent($(this)); 
        });
    });
 

}); // Document ready end
