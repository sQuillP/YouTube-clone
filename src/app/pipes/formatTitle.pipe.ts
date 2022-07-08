import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name:'formatTitle'})
export class FormatTitlePipe implements PipeTransform {
    transform(title:string, length:number = 49):string {
        if(title.length>46)
            return title.substring(0,length)+'...';
        else
            return title;
    }
}