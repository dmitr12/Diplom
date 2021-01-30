import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MusicGenreInfo } from '../models/musicgenre_info';
import { API_URL } from '../app-injection-tokens';
import { MusicInfo } from '../models/music_info';
import { FilteredMusicList } from '../models/filtered_music';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  constructor(private http: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  getFilteredMusicList(filter: FilteredMusicList): Observable<MusicInfo[]> {
    let httpParams = new HttpParams().set('musicName', filter.musicName).set('genreId', filter.genreId.toString());
    return this.http.get<MusicInfo[]>(`${this.apiUrl}api/music/FilterMusic`, { params: httpParams });
  }

  getListMusicGenres(): Observable<MusicGenreInfo[]> {
    return this.http.get<MusicGenreInfo[]>(`${this.apiUrl}api/music/listMusicGenres`)
  }

  getListMusicByUserId(id: number): Observable<MusicInfo[]> {
    return this.http.get<MusicInfo[]>(`${this.apiUrl}api/music/list/` + id);
  }

  getMusicInfoById(id: number): Observable<MusicInfo>{
    return this.http.get <MusicInfo>(`${this.apiUrl}api/music/` + id);
  }

  addmusic(formData: FormData) {
    return this.http.post(`${this.apiUrl}api/music/AddMusic`, formData);
  }

  editmusic(formData: FormData) {
    return this.http.put(`${this.apiUrl}api/music/EditMusic`, formData);
  }

  deleteMusic(idMusic: number): Observable<MusicInfo[]> {
    return this.http.delete<MusicInfo[]>(`${this.apiUrl}api/music/delete/` + idMusic);
  }

  getFileNameByPath(path: string):string {
    var arr = path.split('\\');
    return arr[arr.length - 1];
  }

  checkFileFormat(fileName:string, regularFormat: string): boolean {
    var format = fileName.substring(fileName.indexOf('.') + 1, fileName.length)
    if (format == regularFormat)
      return true;
    return false;
  }

  addLike(idMusic: number) {
    return this.http.post(`${this.apiUrl}api/music/LikeMusic/` + idMusic, {});
  }

  deleteLike(idMusic: number) {
    return this.http.delete(`${this.apiUrl}api/music/DeleteLikeMusic/` + idMusic, {});
  }
}
