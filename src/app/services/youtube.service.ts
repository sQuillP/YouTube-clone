import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map, Observable, throwError, mergeMap, Subject} from "rxjs";
import { API_KEY } from "../environment";
import { FireDatabaseService } from "./firedb.service";

@Injectable({providedIn:'root'})
export class YoutubeService {

    conservationMode:boolean = false;
    conservationMode$ = new Subject<boolean>();
    constructor(
        private http:HttpClient, 
        private router:Router,
        private db:FireDatabaseService,
    ){}
    
    getVideos(title:string):Observable<any> {
        if(this.conservationMode){
            return this.db.getWatchHistory();
        }
        return this.http.get<any>("https://www.googleapis.com/youtube/v3/search", {
            params: {
              key:API_KEY,
              part:'snippet',
              maxResults: 25,
              q:title
            }
          })
          .pipe(
                map(data => {
                    let ids:string[] = [];
                    for(let video of data.items){
                        if(video.id.videoId)
                            ids.push(video.id.videoId);
                    }
                    return ids;
                }),
                mergeMap(data =>{ return  this.mapVideoIds(data)}),
                catchError( (error)=> {
                    console.log(error)
                    this.handleRequestError();
                    return throwError(()=> new Error(error))
                })
            )
          
    }


    getVideoInfo(videoID:string):Observable<any> {
        return this.http.get<any>("https://www.googleapis.com/youtube/v3/videos",{
            params:{
                key: API_KEY,
                part:['snippet','statistics','contentDetails'],
                id: videoID,
            }
        })
        .pipe(
            map(data => {
                if(!data || !data.items.length){
                    throw new Error('No data available');
                }
                return data.items[0]
            }),
            mergeMap((data)=>this.appendChannelImage(data)),
            catchError( (error)=> {
                this.handleRequestError();
                return throwError(()=> new Error(error))
            } )
        )
    }


// grab video duration
// ISO 8601 string.
// Home page must integrate contentDetails (for video duration). 
    getMostPopularVideos():Observable<any>{
        return this.http.get("https://www.googleapis.com/youtube/v3/videos",{
            params:{
                key: API_KEY,
                part: 'snippet, statistics, contentDetails',
                chart: 'mostPopular',
                maxResults:50
            }
        }).pipe(
            map((data:any) => data.items),
            catchError( (error)=> {
                this.handleRequestError();
                return throwError(()=> new Error(error))
            } )
        );
    }



    

    getComments(videoId:string):Observable<any>{
        return this.http.get('https://www.googleapis.com/youtube/v3/commentThreads',{
            params:{
                key: API_KEY,
                videoId: videoId,
                part: 'snippet',
                order: 'relevance',
                maxResults: 20
            }
        })
        .pipe(
            map((data:any) => data.items),
            catchError( (error)=> {
                this.handleRequestError();
                return throwError(()=> new Error(error))
            } )
        );
    }



    setConservationMode(mode:boolean):void{
        this.conservationMode = mode;
        this.conservationMode$.next(mode);
    }

    /*
    * Helper methods below, used for public api calls.    
    */


    // Helper method for getVideos()
    private mapVideoIds(idArray:string[]):Observable<any>{
        return this.http.get<any>("https://www.googleapis.com/youtube/v3/videos",{
            params:{
                key: API_KEY,
                part: 'snippet, statistics, contentDetails',
                id: idArray
            }
        })
        .pipe(
            map(results => results.items)
        )
    }

    
    private appendChannelImage(mergeData:any):Observable<any> {
        return this.http.get("https://www.googleapis.com/youtube/v3/channels",{
            params:{
                key:API_KEY,
                part:'snippet, statistics',
                id:mergeData.snippet.channelId
            }
        })
        .pipe(
            map((data:any) => {
                let appendedObject = {
                    ...data.items[0].snippet,
                    ...data.items[0].statistics
                };
                mergeData['channelDetails'] = appendedObject;
                return mergeData;
            }),
            catchError((err)=> throwError(()=> new Error(err)))
        );
    }

    private handleRequestError():void{
        this.router.navigate(['error']);
    }


    
}