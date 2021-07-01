import * as $ from 'jquery'; 

class TimerComponent {

    private $componentSelector: JQuery;
    private $days: JQuery;
    private $hours: JQuery;
    private $minutes: JQuery;
    private $seconds: JQuery;

    
    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.$days = this.$componentSelector.find('.c-countdown__days');
        this.$hours = this.$componentSelector.find('.c-countdown__hours');
        this.$minutes = this.$componentSelector.find('.c-countdown__minutes');
        this.$seconds = this.$componentSelector.find('.c-countdown__seconds');
         
        this.timer();
        this.initialize();
    }
    
    changeMonthNameToNumber = function(monthName:string): Number {
        var num = Date.parse(monthName + "1, 2018");
        if(!isNaN(num)) {
           return new Date(num).getMonth();
        }
        return -1;
    }

    timer(): void {
        const _self = this;

        let splitTimeAndZone = this.$componentSelector.attr('data-time').split(' ');
        let splitTime;
        if (splitTimeAndZone.length > 1) {
            splitTime = splitTimeAndZone[0].split(':');
        }
        let endTime: any = new Date(
            Number(this.$componentSelector.attr('data-year')),
            Number(this.changeMonthNameToNumber(this.$componentSelector.attr('data-month'))), 
            Number(this.$componentSelector.attr('data-day')),
            Number(splitTime[0] ? splitTime[0] : 0),
            Number(splitTime[1] ? splitTime[1] : 0),
            Number(splitTime[2] ? splitTime[2] : 0),
        );
 
        	
        endTime = (Date.parse(endTime) / 1000);

        let now: any = new Date();
        now = (Date.parse(now) / 1000);

        let timeLeft: any = endTime - now;

        let days: any = Math.floor(timeLeft / 86400); 
        let hours: any = Math.floor((timeLeft - (days * 86400)) / 3600);
        let minutes: any = Math.floor((timeLeft - (days * 86400) - (hours * 3600 )) / 60);
        let seconds: any = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

        if (hours < "10") { hours = "0" + hours; }
        if (minutes < "10") { minutes = "0" + minutes; }
        if (seconds < "10") { seconds = "0" + seconds; }

        _self.$days.html(days);
        _self.$hours.html(hours);
        _self.$minutes.html(minutes);
        _self.$seconds.html(seconds);		
    }


    initialize(): void { 
        const _self = this; 

        setInterval(function() { 
            _self.timer(); 
        }, 1000);
    }
}

$(() => {
    let timerComponentHolder = '.c-countdown';
    
    $(timerComponentHolder).each(function(): void {
        let timerComponentHolder: any = new TimerComponent($(this));
    });
});
