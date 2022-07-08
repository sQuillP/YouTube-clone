import { Component, OnInit, } from '@angular/core';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'app-conservation',
  templateUrl: './conservation.component.html',
  styleUrls: ['./conservation.component.css']
})
export class ConservationComponent implements OnInit {

  isOn:boolean;
  constructor(
    private youtube:YoutubeService
  ) { 
    this.isOn = this.youtube.conservationMode;
  }




  ngOnInit(): void {
    
  }

  onToggle(event:PointerEvent):void{
    console.log(event);
    // event.
    this.youtube.setConservationMode(!this.youtube.conservationMode);
    this.isOn = this.youtube.conservationMode;
  }

}
