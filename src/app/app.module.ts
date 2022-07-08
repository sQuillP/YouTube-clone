import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { ListComponent } from './list/list.component';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { ViewComponent } from './view/view.component';
import { FormatDatePipe } from './pipes/formatDate.pipe';
import { FormatViewsPipe } from './pipes/formatViews.pipe';
import { FormatTitlePipe } from './pipes/formatTitle.pipe';
import { HoverDirective } from './directives/hover.directive';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { PERSISTENCE } from '@angular/fire/compat/auth';
import { FormatTimePipe } from './pipes/formatTimePublished.pipe';
import { FormatCommaPipe } from './pipes/FormatCommaPipe';
import { FormatTagsPipe } from './pipes/formatTags.pipe';
import { ErrorComponent } from './error/error.component';
import { SafeURLPipe } from './pipes/safeUrl.pipe';
import { SavedListComponent } from './saved-list/saved-list.component';
import { AboutComponent } from './about/about.component';
import { ConservationComponent } from './conservation/conservation.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListComponent,
    HomeComponent,
    ViewComponent,
    FormatDatePipe,
    FormatViewsPipe,
    FormatTitlePipe,
    FormatTimePipe,
    FormatCommaPipe,
    FormatTagsPipe,
    SafeURLPipe,
    HoverDirective,
    LoginComponent,
    ErrorComponent,
    SavedListComponent,
    AboutComponent,
    ConservationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideDatabase(() => getDatabase()),
  ],
  providers: [
    {provide: PERSISTENCE, useValue: 'session'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
