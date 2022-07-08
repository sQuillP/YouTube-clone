import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FireDatabaseService } from '../services/firedb.service';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  videoList$:Observable<any>;

  constructor(
    private activatedRoute:ActivatedRoute,
    private youtube:YoutubeService,
    private router:Router,
    private db:FireDatabaseService,
    ) { }

  

  paramSub:Subscription;

  ngOnInit(): void {
    this.paramSub = this.activatedRoute.params.subscribe((params:Params)=> {
      const term:string = params['term'];
      this.videoList$ = this.youtube.getVideos(term);
    });
  }

  ngOnDestroy(): void {
      this.paramSub.unsubscribe();
  }

  onViewVideo(video:any):void{
    this.db.addToWatchHistory(video)
    this.router.navigate(['view',video.id]);
  }


}
