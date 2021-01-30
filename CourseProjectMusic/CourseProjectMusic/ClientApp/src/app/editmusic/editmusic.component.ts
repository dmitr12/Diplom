import { Component, OnInit, Inject } from '@angular/core';
import { MusicGenreInfo } from '../models/musicgenre_info';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MusicService } from '../services/music.service';
import { API_URL } from '../app-injection-tokens';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MusicInfo } from '../models/music_info';
import { AudioService } from '../services/audio.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-editmusic',
  templateUrl: './editmusic.component.html',
  styleUrls: ['./editmusic.component.css']
})
export class EditmusicComponent implements OnInit {

  musicGenres: MusicGenreInfo[] = [];
  form: FormGroup;
  private subscription: Subscription;
  private id: number;
  imageFile: string='';
  musicInfo: MusicInfo = new MusicInfo();
  files: string[] = [];
  formData: FormData;

  constructor(private musicService: MusicService, private router: Router, private activateRoute: ActivatedRoute,
    private audioService: AudioService, public loaderService: LoaderService) {
    this.subscription = activateRoute.params.subscribe(params => this.id = params['id']);
  }

  ngOnInit() {
    document.getElementById("musicName").focus();
    this.musicService.getMusicInfoById(this.id).subscribe(data => {
      this.musicInfo=data;
    }, error => {
        alert(error.message);
    })
    this.musicService.getListMusicGenres().subscribe(data => {
      this.musicGenres = data
    }, error => {
      alert(error.message)
    });
    this.formData = new FormData();
    this.formData.append("Id", this.id.toString())
    this.form = new FormGroup({
      musicName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      musicFileName: new FormControl(null),
      musicImageName: new FormControl(null),
      musicGenreId: new FormControl(this.musicInfo.genreId, [Validators.required])
    })
  }

  changeImageFile(files: any) {
    this.formData.delete("MusicImageFile");
    this.formData.append("MusicImageFile", files[0], files[0].name);
  }

  changeMusicFile(files: any) {
    this.formData.delete("MusicFile");
    this.formData.append("MusicFile", files[0], files[0].name);
  }

  edit() {
    let fileImageName;
    let fileMusicName;
    if (this.form.value.musicImageName === null)
      fileImageName = '';
    else
      fileImageName = this.musicService.getFileNameByPath(this.form.value.musicImageName)
    if (this.form.value.musicFileName === null)
      fileMusicName = '';
    else
      fileMusicName = this.musicService.getFileNameByPath(this.form.value.musicFileName)
    if (fileMusicName) {
      if (!this.musicService.checkFileFormat(fileMusicName, "mp3")) {
        alert('Выбран неверный формат аудозаписи')
        return;
      }
    }
    if (fileImageName) {
      if (!this.musicService.checkFileFormat(fileImageName, 'png') && !this.musicService.checkFileFormat(fileImageName, 'jpg')) {
        alert('Выбран неверный формат изображения')
        return;
      }
    }
    this.formData.delete("MusicGenreId");
    this.formData.delete("MusicName");
    this.formData.append("MusicGenreId", this.form.value.musicGenreId);
    this.formData.append("MusicName", this.form.value.musicName);
    this.musicService.editmusic(this.formData).subscribe((response: any) => {
      if (response['msg'] == '') {
        if (this.audioService.idMusic == this.id) {
          this.audioService.clearMusic();
        }
        this.router.navigate(['']);
      }
      else {
        alert(response['msg']);
      }
    },
      err => alert('Статусный код ' + err.status),
    );
  }
}
