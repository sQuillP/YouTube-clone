import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;

  mode:string = 'login';

  invalidForm:boolean = false;
  triggerShake:boolean = false;

  timer:any = null;

  loginTypeSubscription:Subscription;

  constructor(
    private route:ActivatedRoute,
    private auth:AuthService,
    private router:Router
    ) { 
      this.loginForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
      });
      console.log(this.loginForm)
  }

  ngOnInit(): void {

    

    if(history.state.loginType)
      this.mode = history.state.loginType;
    
    this.loginTypeSubscription = this.auth.loginType.subscribe(loginType => {
      this.mode = loginType;
    });
  }



  onSubmit(method:string):void{

    console.log('clicked')

    // prereq to login
    if(!this.loginForm.valid) return;

    const email:string = this.loginForm.get('email').value;
    const password:string = this.loginForm.get('password').value;
    
    if(method === 'signup')
      this.auth.signup(email,password).then(resolved => {
        if(!resolved)
          this.displayError();
        else
          this.router.navigate(['home']);
      });
    else
      this.auth.login(email,password).then(resolved => {
        if(!resolved)
          this.displayError();
        else
          this.router.navigate(['home']);
      });

  }

  displayError():void{
    this.invalidForm = true;
    this.triggerShake = true;
    this.clearFields();
    if(this.timer)
      clearInterval(this.timer);
    this.timer = setTimeout(()=>{
      this.triggerShake = false;
    },800);
  }


  clearFields():void{
    this.loginForm.get('email').setValue('');
    this.loginForm.get('password').setValue('');
  }


}
