import { Component, OnInit, Inject } from '@angular/core';
import { MusicGenreInfo } from '../models/musicgenre_info';
import { MusicService } from '../services/music.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../app-injection-tokens';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-addmusic',
  templateUrl: './addmusic.component.html',
  styleUrls: ['./addmusic.component.css']
})
export class AddmusicComponent implements OnInit {

  musicGenres: MusicGenreInfo[] = [];
  form: FormGroup;

  files: string[] = [];
  formData: FormData;

  constructor(private musicService: MusicService, private http: HttpClient, @Inject(API_URL) private apiUrl: string,
    private router: Router, public loaderService: LoaderService) { }

  ngOnInit() {
    this.formData = new FormData();

    this.form = new FormGroup({
      musicName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      musicFileName: new FormControl(null, [Validators.required]),
      musicImageName: new FormControl(null),
      musicGenreId: new FormControl(null, [Validators.required])
    })

    this.musicService.getListMusicGenres().subscribe(data => {
      this.musicGenres = data
    }, error => {
      alert(error)
    });
  }

  changeImageFile(files: any) {
    this.formData.delete("MusicImageFile");
    this.formData.append("MusicImageFile", files[0], files[0].name);
  }

  changeMusicFile(files: any) {
    this.formData.delete("MusicFile");
    this.formData.append("MusicFile", files[0], files[0].name);
  }

  add() {
    let fileImageName;
    let fileMusicName = this.musicService.getFileNameByPath(this.form.value.musicFileName);
    if (this.form.value.musicImageName===null)
      fileImageName = '';
    else
      fileImageName = this.musicService.getFileNameByPath(this.form.value.musicImageName)
    if (!this.musicService.checkFileFormat(fileMusicName, "mp3")) {
      alert('Выбран неверный формат аудозаписи')
      return;
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
    this.musicService.addmusic(this.formData).subscribe((response: any) => {
        if (response['msg'] == '') {
          this.router.navigate(['']);
        }
        else
          alert(response['msg']);
        },
          err => alert('Статусный код '+err.status),
      );
  }

}
