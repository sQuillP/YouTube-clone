import { Pipe, PipeTransform } from "@angular/core";


@Pipe({name:'formatTime'})
export class FormatTimePipe implements PipeTransform {


    private pluralize(value:number, time:string):string{
        value = Math.floor(value);
        if(value ===1)
            return value + " " + time +' ago';
        return value + " " +time+'s ago';
    }

    transform(date:string):string {

        let timeDifference:number = Date.now() - Date.parse(date);

        let years = timeDifference/(1000*60*60*24*365);
        let months = timeDifference/(1000*60*60*24*31);
        let weeks = timeDifference/(1000*60*60*24*7);
        let days = timeDifference/(1000*60*60);

        if(Math.floor(years)>=1)
            return this.pluralize(years,"year")
        else if(Math.floor(months) >= 1)
            return this.pluralize(months,"month");
        else if(Math.floor(weeks) >= 1)
            return this.pluralize(weeks,"week");
        else if(Math.floor(days)>=1)
            return this.pluralize(days,"day");
        return "today"

        // today, days, weeks, months, year
    }
}