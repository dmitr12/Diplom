import { Component, OnInit } from '@angular/core';
import { MusicService } from '../services/music.service';
import { MusicInfo } from '../models/music_info';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MusicGenreInfo } from '../models/musicgenre_info';
import { AudioService } from '../services/audio.service';
import jwt_decode from 'jwt-decode';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-musicinfo',
  templateUrl: './musicinfo.component.html',
  styleUrls: ['./musicinfo.component.css']
})
export class MusicinfoComponent implements OnInit {

  userId: number;
  id: number;
  musicGenres: MusicGenreInfo[] = [];
  data: MusicInfo = new MusicInfo();
  liked: boolean = false;
  private subscription: Subscription;


  constructor(private musicService: MusicService, private audioService: AudioService, private activateRoute: ActivatedRoute, private authService: AuthService) {
    this.subscription = activateRoute.params.subscribe(params => this.id = params['id']);
  }

  ngOnInit() {
    this.userId = jwt_decode(this.authService.getAccessToken())['sub'];
    this.musicService.getMusicInfoById(this.id).subscribe(response => {
      this.data = response;
      if (this.data.idOfUsersLike.filter(x => x == this.userId).length > 0) {
        this.liked = true;
      }
      else {
        this.liked = false;
      }
    }, error => {
      alert('Статусный код ' + error.status)
    });
    this.musicService.getListMusicGenres().subscribe(data => {
      this.musicGenres = data
    }, error => {
      alert(error)
    });
  }
  

  addLike(idMusic: number) {
    this.musicService.addLike(idMusic).subscribe(response => {
      this.liked = true;
      this.data.idOfUsersLike.push(this.userId);
    })
  }

  deleteLike(idMusic: number) {
    this.musicService.deleteLike(idMusic).subscribe(response => {
      this.liked = false;
      this.data.idOfUsersLike = this.data.idOfUsersLike.filter(x => x != this.userId);
    })
  }

  getMusicGenreName(id: number) {
    return this.musicGenres.filter(g => g.id === id)[0].name;
  }
}
