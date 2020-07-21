interface JQuery {
    datepicker({}):void;
}
interface Window {
    [key:string]: any; // Add index signature
}
class CalendarPickerComponent {

    private $componentSelector: JQuery;
    private $daySelectorInput: JQuery;
    private $monthSelectorInput: JQuery;
    private $yearSelectorInput: JQuery;
    private $calendarTrigger: JQuery;
    private $calendarButton: JQuery;
    private isMobile: Boolean;
    private $closeCalendar: JQuery;
    private includeDays: Array<string>;

    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.$daySelectorInput = this.$componentSelector.find('.day-input');
        this.$monthSelectorInput = this.$componentSelector.find('.month-input');
        this.$yearSelectorInput = this.$componentSelector.find('.year-input');
        this.$calendarTrigger = this.$componentSelector.find('.calendar-trigger');
        this.$calendarButton = this.$componentSelector.find('.calendar-button');
        this.$closeCalendar = this.$componentSelector.find('.close-overlay');
        this.init();

        const _self = this;
        this.$calendarTrigger.datepicker({
            beforeShow: function(textbox: String, instance: any) {
                $('.calendar-wrapper').append($('#ui-datepicker-div'));
                var calendar = instance.dpDiv;
                var topPos: any, leftPos: any, rightPos :any;
                if (_self.isMobile) {
                    topPos = "10%";
                    leftPos = "2%";
                    rightPos = "2%";
                    $('.calendar-overlay').show();
                    setTimeout(function () {
                        calendar.css({
                            top: topPos,
                            left: leftPos, 
                            right: rightPos,
                            position: 'fixed'
                        });
                        $('.ui-datepicker').prepend($('.calendar-top-header'));
                        $('.calendar-top-header').show();
                    }, 100);
                } else {
                    topPos = $('.calendar-wrapper').outerHeight() + 7; //margin added
                    leftPos = $('.calendar-button').outerWidth() - $('#ui-datepicker-div').outerWidth();
                    setTimeout(function () {
                        calendar.css({
                            top: topPos,
                            left: leftPos
                        });
                    }, 0);
                }
                _self.$calendarButton.removeClass('is-white-on-red').addClass('is-dark-grey-on-white');
            },
            onSelect: function(dateText: String, instance: any) {
                var splitDate = dateText.split('/');
                _self.$monthSelectorInput.val(splitDate[0]).focus().blur();
                _self.$daySelectorInput.val(splitDate[1]).focus().blur();
                _self.$yearSelectorInput.val(splitDate[2]).focus().blur();
                if (_self.isMobile) {
                    _self.hideCalendarParts();
                }
            },
            onClose: function(dateText: String, instance: any) {
                _self.$calendarButton.removeClass('is-dark-grey-on-white').addClass('is-white-on-red');
                if (_self.isMobile) {
                    _self.hideCalendarParts();
                }
            }, 
            beforeShowDay: function (date: any) {
                if (!_self.$componentSelector.data('include-today')) {
                    var today: Date = new Date();
                    if (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()) {
                        return [false];
                    }
                }
                var day = date.getDay();
                return [(_self.includeDays.indexOf(day) != -1)];
            },
            minDate: _self.setMinMaxDates(_self.$componentSelector.data('past-date')),
            maxDate: _self.setMinMaxDates(_self.$componentSelector.data('future-date')),
            duration: "slow",
            showAnim: "fadeIn"
        });
    }

    init() {
        const _self = this;
        this.$calendarButton.on('click', function(e) {
            e.preventDefault();
            var calendarDisplay = $('#ui-datepicker-div').css('display');
            _self.$calendarTrigger.datepicker(calendarDisplay == 'none' ? 'show' : 'hide');
        });

        this.$closeCalendar.on('click', function() {
            _self.$calendarTrigger.datepicker('hide');
        });

        var inputs = _self.$componentSelector.find('input[type=text]');
        inputs.each(function() {
            $(this).on("focusout", function() {
                var dayValue = _self.$daySelectorInput.val().toString();
                var monthValue = _self.$monthSelectorInput.val().toString();
                var yearValue = _self.$yearSelectorInput.val().toString();
                if (dayValue.length > 0  && 
                    monthValue.length > 0 && 
                    yearValue.length > 0
                ) {
                    _self.$calendarTrigger.val(monthValue + "/" + dayValue + "/" + yearValue);
                }
            });
        });

        $(window).on("resize", function(e) {
            _self.isMobile = _self.checkMobile();
            _self.isMobile ? _self.$componentSelector.addClass('is-mobile') : _self.$componentSelector.removeClass('is-mobile');

        });

        _self.includeDays = _self.$componentSelector.data('include-days');
        _self.isMobile = false;

        $(window).trigger('resize');
    }


    setMinMaxDates(otherDays: boolean): Date {
        if (!otherDays) {
           return new Date();
       }

       return null;
    }

    hideCalendarParts() {
        $('.calendar-overlay').hide();
        $('.calendar-overlay').prepend($('.calendar-top-header'));
        $('.calendar-top-header').hide();
    }

    checkMobile() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window["opera"]);
        return check;
    }
}

$(() => {
    let calendarPickerComponentHolder = '.f-forms--calendar-picker';
    
    $(calendarPickerComponentHolder).each(function(): void {
        let calendarPickerComponent: any = new CalendarPickerComponent($(this));
    });
});
