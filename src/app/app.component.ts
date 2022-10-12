import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { YoutubeService } from './services/youtube.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'youtube';

  constructor(private youtube:YoutubeService){
    alert("Some features may not work if you are not using chrome. Do not worry, I will eventually get around to this issue.");
  }


  ngOnInit(): void {

  }


  callAPI(){

  }

}
