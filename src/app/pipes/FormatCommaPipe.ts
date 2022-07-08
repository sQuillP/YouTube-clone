import { Pipe, PipeTransform } from "@angular/core";



@Pipe({name:'formatViewNum'})
export class FormatCommaPipe implements PipeTransform{
    transform(num:number):string {
        let str = String(num);
        let answer = "";
        if(str.length<4)
            return str;
        let firstComma = (str.length)%3;
        if(firstComma ===0)
            firstComma = 3;
        answer = str.substring(0,firstComma)+',';
        let counter = 0;
        for(let i = firstComma; i< str.length; i++){
            if(counter===0 && i!==firstComma && i !== str.length-1)
                answer += ',';
            counter = (counter+1)%3;
            answer += str[i];
        }
        return answer;
    }
}