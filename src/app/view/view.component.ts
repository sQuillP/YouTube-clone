import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FireDatabaseService } from '../services/firedb.service';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, OnDestroy {

  // HQyVVTh4p8

  videoURL:string;

  routeSubscription:Subscription;
  disableButtonSub:Subscription;

  descriptionLength:number = 100;

  isLoggedIn:boolean = false;
  alreadyFavorited:boolean = false;


  video$:Observable<any>;
  recommendedList$:Observable<any>;
  commentList$:Observable<any>;

  constructor(
    private youtube:YoutubeService,
    private route:ActivatedRoute,
    private router:Router,
    private auth: AuthService,
    private db: FireDatabaseService,
  ) { }

  ngOnInit(): void {


    // get logged in status of the user.
    this.isLoggedIn = this.auth.isLoggedIn;
  
    

    this.routeSubscription = this.route.params.subscribe((videoId:any) => {
      const id:string = videoId['id'];

      this.videoURL = "https://www.youtube.com/embed/"+ id;


      // this should use some fixing i.e, put this into a route guard.
      if(!id){
        console.error('Invalid query parameters!');
        this.router.navigate(['home']);
        return;
      }

      if(this.isLoggedIn)
        this.checkIfFavorite(id);
      else{
        this.auth.isLoggedIn$.subscribe(loggedIn =>{ 
          this.isLoggedIn = loggedIn
          if(!loggedIn) return;
            this.checkIfFavorite(id);
        });
      }

      //grab video information
      this.video$ = this.youtube.getVideoInfo(id);

      // grab comments and recommended videos
      this.video$.subscribe(data => {
        this.commentList$ = this.youtube.getComments(data.id);
        this.recommendedList$ = this.youtube.getVideos(data.snippet.title);
      });      
    });
  }


  onRevealDescription():void{
    if(this.descriptionLength === 100)
      this.descriptionLength = undefined;
    else
      this.descriptionLength = 100;
  }


  onViewVideo(videoId:string):void{
    this.router.navigate(['view',videoId]);
  }


  onAddFavorite(video:any):void{
    this.alreadyFavorited = true;
    this.db.saveVideo(video);
  }

  checkIfFavorite(id:string):void{
    this.disableButtonSub = this.db.getSavedVideos().subscribe((videos:any[]) => {
      console.log(videos)
      if(!videos) return;
      for(let video of videos){
        if(video.id === id){
          console.log('already favorited')
          this.alreadyFavorited = true;
          return;
        }
      }
      console.log(this.isLoggedIn,this.alreadyFavorited);
    })
  }

  ngOnDestroy(): void {
      this.routeSubscription.unsubscribe();
      if(this.disableButtonSub)
        this.disableButtonSub.unsubscribe();
  }
}
