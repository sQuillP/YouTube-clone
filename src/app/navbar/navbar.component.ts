import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {


  term:string;

  loggedInSubscription:Subscription;
  
  toggleCollapsedMenu:boolean = false;
  isLoggedIn:boolean = false;

  conservationMode:boolean = false;

  conservationSub:Subscription;
  @ViewChild('collapsedMenu') collapsedLinks:ElementRef;
  @ViewChild('toggleMenuBtn') toggleMenuBtn:ElementRef;

  clickListener:()=>void;
  constructor(
    private router:Router,
    private auth:AuthService,
    private renderer:Renderer2,
    private youtube:YoutubeService,
    ) {
      this.conservationSub = this.youtube.conservationMode$.subscribe(mode => {
        this.conservationMode = mode;
      })
    }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn;
    this.loggedInSubscription = this.auth.isLoggedIn$.subscribe(loggedIn=> {
      this.isLoggedIn = loggedIn;
    });
  }

  ngAfterViewInit(): void {
    this.clickListener = this.renderer.listen('body','click',(event:PointerEvent)=> {
      if(!this.collapsedLinks.nativeElement.contains(event.target) && !this.toggleMenuBtn.nativeElement.contains(event.target))
        this.toggleCollapsedMenu = false;
    })
  }


  onNavigate(paths:string[]):void{
    this.toggleCollapsedMenu = false;
    if(paths[0]==='login'){
      this.auth.setLoginType(paths[1]);
      this.router.navigate([paths[0]],{state:{loginType:paths[1]}});
      return;
    }
    this.router.navigate(paths);
  }

  onSearchTerm(event:KeyboardEvent):void{
    if(event.key==='Enter'){
      if(!this.term) return;
      this.router.navigate(['list',this.term]);
      this.term = '';
    }

  }


  onHandleButtonClick():void{
    if(!this.term) return;

    this.router.navigate(['list',this.term]);
  }

  onLogout():void{
    this.auth.logout();
    this.router.navigate(['home']);
  }


  ngOnDestroy(): void {
      this.clickListener();
  }

}
