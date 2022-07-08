import { Pipe, PipeTransform } from "@angular/core";



@Pipe({name:'formatDate'})
export class FormatDatePipe implements PipeTransform{
    
    dates:string[] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    transform(zuluDate:string):string {
        // zuluDate.match
        const dateArray:string[] = zuluDate.split('-');
        const month:string = this.dates[Number(dateArray[1])-1];
        const year:string = dateArray[0];
        const day:string = dateArray[2].substring(0,2);
        
        return month+", "+day+" "+year;
    }
}