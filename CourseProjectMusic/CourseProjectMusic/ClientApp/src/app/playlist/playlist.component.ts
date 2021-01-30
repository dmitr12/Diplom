import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../app-injection-tokens';
import { MusicInfo } from '../models/music_info';
import { Router } from '@angular/router';
import { MusicService } from '../services/music.service';
import jwt_decode from 'jwt-decode';
import { AuthService } from '../services/auth.service';
import { AudioService } from '../services/audio.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  constructor(private http: HttpClient, private musicService: MusicService, private router: Router,
    private authService: AuthService, private audioService: AudioService, public loaderService: LoaderService) { }

  files: MusicInfo[] = [];
  userName: string;

  facts = [];

  ngOnInit() {
    this.userName = jwt_decode(this.authService.getAccessToken())['login'];
    this.musicService.getListMusicByUserId(jwt_decode(this.authService.getAccessToken())['sub']).subscribe(result => {
      this.files = result;
    }, error => {
        alert(error.message)
    })
  }

  btnAddMusicClick() {
    this.router.navigate(['addmusic']);
  }

  btnEditMusicClick(id) {
    this.router.navigate(['editmusic',`${id}`]);
  }

  deleteMusic(id) {
    this.musicService.deleteMusic(id).subscribe(result => {
      this.files = result;
      if (this.audioService.idMusic == id) {
        this.audioService.clearMusic();
      }
    }, error => {
      alert(error.message);
    });
  }

  clearMusic() {
    this.audioService.clearMusic();
  }

  openFile(idM, url, name) {
    this.audioService.openFile(idM, url, name);
  }
}
