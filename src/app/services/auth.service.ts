import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { BehaviorSubject, Subject, Subscription } from "rxjs";


@Injectable({providedIn:'root'})
export class AuthService {


    public loginType = new Subject<string>();

    user:any;

    isLoggedIn:boolean = false;

    isLoggedIn$ = new Subject<boolean>();

    persistentSub:Subscription;
    constructor(
        private auth:AngularFireAuth
    ){
        this.persistentSub = this.auth.authState.subscribe((user:any)=> {
            if(user){
                this.user = user;
                console.log(this.user)
                this.isLoggedIn = true;
                localStorage.setItem('user',JSON.stringify(this.user));
                this.isLoggedIn$.next(true);
                // JSON.parse(localStorage.getItem('user')!);
            } else {
                this.user = null;
                this.isLoggedIn$.next(false);
                this.isLoggedIn = false;
                localStorage.setItem('user',null);
                // console.log(JSON.parse(localStorage.getItem('user')!));
            }
        })
    }


    setLoginType(loginType:string):void{
        this.loginType.next(loginType);
    }



    login(email:string, password:string):Promise<any>{
        return this.auth.signInWithEmailAndPassword(email,password).then(data => {
            console.log('logging in should have worked',data);
            this.user = data.user;
            console.log(data);
            console.log(this.user)
            this.isLoggedIn = true;
            this.isLoggedIn$.next(true);
            return true;
        }).catch(error => {console.log(error); return false;});
    }


    signup(email:string, password:string):Promise<boolean>{
        return this.auth.createUserWithEmailAndPassword(email, password).then(response => {
            console.log('sign up should work', response);
            this.user = response.user;
            this.isLoggedIn = true;
            this.isLoggedIn$.next(true);
            return true;
        }).catch(err=> {
            console.log('something went wrong',err); 
            return false;
        });
    }


    logout():void{
        this.auth.signOut().then(fulfilled=>{
            console.log(fulfilled)
            this.isLoggedIn = false;
            this.isLoggedIn$.next(false);
        })
        .catch(error => console.log('error logging out',error));
    }


}