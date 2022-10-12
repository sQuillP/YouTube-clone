import { Injectable, } from "@angular/core";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map, Observable, Subscription } from "rxjs";
import { AuthService } from "./auth.service";


/*
* Promises are used instead of async/await. 
*/

@Injectable({providedIn:'root'})
export class FireDatabaseService {
    
    private _userId:string;

    // Make sure you do a conservation mode, use data from history and favorites to display on the recommendations


    loggedSub:Subscription
    constructor(
        private afd:AngularFireDatabase,
        private auth: AuthService
        ){
            if(this.auth.isLoggedIn)
                this._userId = this.auth.user.multiFactor.user.uid;
            this.loggedSub = this.auth.isLoggedIn$.subscribe(isLoggedIn => {
                if(isLoggedIn)
                    this._userId = this.auth.user.multiFactor.user.uid;
            })
        }




    // If the video is recently watched, move it to the end of the watch history
    addToWatchHistory(video:any):void{
        console.log('isloggedin',this.auth.isLoggedIn, this._userId)
        if(!this.auth.isLoggedIn) return;
        let dbURL = '/users/'+this._userId+'/videos/history/';
        this.getWatchHistory()
        .subscribe(history => {
            this.enforceHistoryLimit(history,dbURL)
            .then(removedItem=> {
                if(!removedItem)
                    return removedItem
                return this.shiftVideoToMostRecent(video,history,dbURL)
            })
            .then((shifted)=>{
                console.log('should reach this method',shifted)
                if(shifted) return;
                
                this.pushToWatchHistory(video);
            })
        });

        // Otherwise just push it to the watch history
    }


    getWatchHistory(): Observable<any> {
        if(!this.auth.isLoggedIn) return;
        return new Observable((observer) => {
            this.afd.database.ref('users/'+this._userId+'/videos/history').get().then(snapshot => {
                if(!snapshot.exists())
                    observer.next(null);
                else
                    observer.next(snapshot.val());
                observer.complete();
            })
        })
        .pipe(
            map(data=> {
                if(!data) return data;
                const transformData = [];
                for(const key of Object.keys(data)){
                    data[key].fbId = key;
                    transformData.push(data[key]);
                }
                return transformData.reverse();
            }),
        )
    }

    saveVideo(video:any):void{
        if(!this.auth.isLoggedIn) return;
        this.afd.database.ref('users/'+this._userId+'/videos/saved').push().set(video, error => {
            if(error)
                console.log("video save unsuccessful");
            else
                console.log('video save successful');
        });
    }


    getSavedVideos():Observable<any>{
        console.log('getting saved videos')
        return new Observable((observer)=> {
            if(!this.auth.isLoggedIn){
                observer.next(null);
                observer.complete();
            }
            this.afd.database.ref('users/'+this._userId+'/videos/saved').get().then( snapshot => {
                if(!snapshot.exists()){
                    observer.next(null);
                }
                else
                    observer.next(snapshot.val());
                observer.complete();
            });
        })
        .pipe(
            map((data)=> {
                if(!data) return data;
                const transformdata = [];
                for(const key of Object.keys(data)){
                    data[key].fbId = key;
                    transformdata.push(data[key]);
                }
                return transformdata;
            })
        )
    }


     private enforceHistoryLimit(history:any[],dbURL:string):Promise<boolean>{
        if(!history || history.length<50)
            return new Promise((resolve,reject)=>{resolve(false);})

        let fbId = history[history.length-1].fbId;
        delete history[history.length-1].fbId;

        return this.afd.database.ref(dbURL+fbId).remove().then(()=>{
            console.log('clipping watch history (limited to 50 items)');
            return true;
        });
    }


    //return a promise resolving to true if the video has been shifted to most recent, false otherwise.
    private shiftVideoToMostRecent(recentlyWatchedVideo:any, history:any[],dbURL:string):Promise<boolean> {
        for(const videoItem of history){
            if(videoItem.id === recentlyWatchedVideo.id){
                recentlyWatchedVideo = videoItem;
                let fbId = recentlyWatchedVideo.fbId;
                delete recentlyWatchedVideo.fbId;
                return this.afd.database
                        .ref(dbURL+fbId)
                        .remove()
                        .then(()=> {
                            return this.afd.database.ref(dbURL).push().set(recentlyWatchedVideo, error=> {
                                if(error) console.error('unable to re-add video to recently watched');
                            })
                            .then(()=> true);
                        })
            }
        }
        return new Promise<boolean>((resolve,reject)=>{ resolve(false)})
    }

 
    private pushToWatchHistory(video):void{
        this.afd.database.ref('users/'+this._userId+'/videos/history').push().set(video, error => {
            if(error)
                console.log('unsuccessful add to history');
            else
                console.log('successful add to history');
        });
    }

}
