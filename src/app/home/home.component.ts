import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FireDatabaseService } from '../services/firedb.service';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  videos$:Observable<any>;

  private isLoading:boolean = false;

  constructor(
    private youtube:YoutubeService,
    private router:Router,
    private db:FireDatabaseService
    ) { }



  ngOnInit(): void {
    this.isLoading = true;
    // if(localStorage.getItem('popularVideos'))
    this.videos$ = this.youtube.getMostPopularVideos();
  }


  onSelectVideo(video:any):void{
    this.db.addToWatchHistory(video);
    this.router.navigate(['view',video.id]);
  }


}
