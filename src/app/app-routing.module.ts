import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { SavedListComponent } from './saved-list/saved-list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},

  {path: 'login', component: LoginComponent},

  {path: 'view/:id', component: ViewComponent},

  {path:'savedList/:type', component:SavedListComponent},

  {path:'list/:term',component: ListComponent},

  {path: 'error', component:ErrorComponent},

  {path:'about', component:AboutComponent},

  {path:'**', redirectTo:'/home', pathMatch:'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
