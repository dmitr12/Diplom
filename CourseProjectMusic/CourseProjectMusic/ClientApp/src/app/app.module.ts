import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { JwtModule } from '@auth0/angular-jwt'
import { API_URL } from './app-injection-tokens';
import { environment } from '../environments/environment';
import { ACCESS_TOKEN } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { AuthlayoutComponent } from './layouts/authlayout/authlayout.component';
import { RegisterComponent } from './register/register.component';
import { log } from 'util';
import { AudioplayerComponent } from './audioplayer/audioplayer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { AuthGuard } from './guards/auth-guard';
import { ApplayoutComponent } from './layouts/applayout/applayout.component';
import { PlaylistComponent } from './playlist/playlist.component';
import {
  MatSidenavModule, MatSelectModule, MatToolbarModule, MatButtonModule, MatListModule, MatMenuModule, MatProgressBarModule,
  MatProgressSpinnerModule} from '@angular/material';
import { AddmusicComponent } from './addmusic/addmusic.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EditmusicComponent } from './editmusic/editmusic.component';
import { SearchMusicComponent } from './search-music/search-music.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MusicinfoComponent } from './musicinfo/musicinfo.component';
import { MusicInfo } from './models/music_info';
import { InterceptorService } from './services/interceptor.service';

export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN);
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    LoginComponent,
    AuthlayoutComponent,
    RegisterComponent,
    AudioplayerComponent,
    ApplayoutComponent,
    PlaylistComponent,
    AddmusicComponent,
    EditmusicComponent,
    SearchMusicComponent,
    MusicinfoComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatIconModule,
    MatSelectModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    NgxPaginationModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    ScrollingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter/*,*/
        //whitelistedDomains: environment.tokenWhiteListedDomains
      }
    }),
    RouterModule.forRoot([
      {
        path: 'auth', component: AuthlayoutComponent, children: [
          { path: '', redirectTo: '/login', pathMatch: 'full' },
          { path: 'login', component: LoginComponent },
          { path: 'register', component: RegisterComponent }
        ]
      },
      {
        path: '', component: ApplayoutComponent, canActivate: [AuthGuard], children: [
          { path: '', redirectTo: 'playlist', pathMatch: 'full'},
          { path: 'playlist', component: PlaylistComponent },
          { path: 'addmusic', component: AddmusicComponent },
          { path: 'searchmusic', component: SearchMusicComponent },
          { path: 'editmusic/:id', component: EditmusicComponent },
          { path: 'musicinfo/:id', component: MusicinfoComponent }
        ]
      }
      //{ path: '', component: HomeComponent, pathMatch: 'full' },
      //{ path: 'counter', component: CounterComponent },
      //{ path: 'fetch-data', component: FetchDataComponent },
      //{ path: 'login', component: LoginComponent },
    ]),
    BrowserAnimationsModule
  ],
  providers: [{
    provide: API_URL,
    useValue: environment.api
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
