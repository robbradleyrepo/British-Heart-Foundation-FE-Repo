export class Engraving {
    private name: string;
    private day: string;
    private month: string;
    private year: string;

    constructor(name: string, day: string, month: string, year: string) {
        this.name = name;
        this.day = day;
        this.month = month;
        this.year = year;
    }

    public getName(): string {
        return this.name;
    }

    public getDate(): Object {
        return { day: this.day, 
                month: this.month, 
                year: this.year};
    }
}