import { Directive, ElementRef, HostListener } from "@angular/core";


@Directive({
    selector:'[videohover]'
})
export class HoverDirective {
    
    constructor(private element:ElementRef){
        this.element.nativeElement.style.transition = 'transform 100ms linear';
    }

    @HostListener('mouseenter') 
    onMouseEnter():void{
        this.element.nativeElement.style.transform = 'scale(1.1)';
    }

    @HostListener('mouseleave')
    onMouseLeave():void{
        this.element.nativeElement.style.transform = 'scale(1.0)';
    }
}