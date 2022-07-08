import { Pipe, PipeTransform } from "@angular/core";


@Pipe({name:'formatViews'})
export class FormatViewsPipe implements PipeTransform {
    transform(views:string):string {

        if(views === '0')
            return '';
        else if(views.length < 4)
            return views;
        else if(views.length < 7)
            return (+views/1000).toFixed(1)+'k';
        else if(views.length < 10)
            return (+views/1000000).toFixed(1)+'m';
        else if(views.length < 13)
            return (+views/1000000000).toFixed(1)+'b'
        else
            return 'too many!'
    }
}