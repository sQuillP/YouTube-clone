import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FireDatabaseService } from '../services/firedb.service';

@Component({
  selector: 'app-saved-list',
  templateUrl: './saved-list.component.html',
  styleUrls: ['./saved-list.component.css']
})
export class SavedListComponent implements OnInit, OnDestroy {


  // use guards for this class??

  videoList$:Observable<any>;

  authSub:Subscription;

  listSub:Subscription;

  noData:boolean = false;

  videoType:string = '';

  constructor(
    private db:FireDatabaseService,
    private route:ActivatedRoute,
    private auth:AuthService,
    private router:Router,
  ) { 

  }

  ngOnInit(): void {
    this.route.params.subscribe((params:Params)=> {

      this.videoType = params['type'];
      this.fetchVideoContent(params['type'], this.auth.isLoggedIn);

      this.authSub = this.auth.isLoggedIn$.subscribe((loggedIn:boolean)=> {
        this.fetchVideoContent(params['type'], loggedIn);
      });

    })
  }


  fetchVideoContent(videoType:string, loggedIn:boolean){
    if(videoType === 'saved' && loggedIn)
      this.videoList$ = this.db.getSavedVideos();
    else if(loggedIn)
      this.videoList$ = this.db.getWatchHistory();
    
    if(this.videoList$){
      this.listSub = this.videoList$.subscribe(data =>{ 
        if(!data)
          this.noData = true;
        else
          this.noData = false;
      });
    }
  }


  onViewVideo(video:any):void{
    this.db.addToWatchHistory(video);
    this.router.navigate(['view',video.id]);
  }


  ngOnDestroy(): void {
    this.listSub.unsubscribe();
  }

}
