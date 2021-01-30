import { Component, OnInit } from '@angular/core';
import { MusicGenreInfo } from '../models/musicgenre_info';
import { MusicService } from '../services/music.service';
import { FormGroup, FormControl } from '@angular/forms';
import { FilteredMusicList } from '../models/filtered_music';
import { MusicInfo } from '../models/music_info';
import { AudioService } from '../services/audio.service';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-search-music',
  templateUrl: './search-music.component.html',
  styleUrls: ['./search-music.component.css']
})
export class SearchMusicComponent implements OnInit {

  musicGenres: MusicGenreInfo[] = [];
  dataSearch: MusicInfo[] = [];
  form: FormGroup;
  selectedOption = '0';
  filteredList: FilteredMusicList = new FilteredMusicList();
  totalRecords: string;
  page: number = 1;

  constructor(private musicService: MusicService, private audioService: AudioService, private router: Router,
    public loaderService: LoaderService) { }

  ngOnInit() {
    this.musicService.getListMusicGenres().subscribe(data => {
      this.musicGenres = data
    }, error => {
      alert(error)
    });

    this.form = new FormGroup({
      musicName: new FormControl(""),
      musicGenreId: new FormControl("0")
    })
  }

  getGenreName(id: number) {
    return this.musicGenres.find(g => g.id === id).name;
  }

  search() {
    this.filteredList.musicName = this.form.value.musicName;
    this.filteredList.genreId = this.form.value.musicGenreId;
    this.musicService.getFilteredMusicList(this.filteredList).subscribe(result => {
      this.dataSearch = result;
    }, error => {
        alert('Статусный код '+error.status)
    })
  }

  getInfoPage(id: number) {
    this.router.navigate(['musicinfo', `${id}`])
  }
}
