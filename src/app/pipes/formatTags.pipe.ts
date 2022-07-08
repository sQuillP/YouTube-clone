import { Pipe, PipeTransform } from "@angular/core";



@Pipe({name:'formatTags'})
export class FormatTagsPipe implements PipeTransform{

    transform(tags:[]):string {
        return tags.slice(0,3).map((tag:string)=> "#"+tag).join(' ');
    }
}