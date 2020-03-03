import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONF } from './services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SongList, SongUrl, Song, Lyric } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: ServicesModule
})
export class SongService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONF) private uri: string
  ) {}

  // 获取歌曲信息
  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http
      .get(this.uri + 'song/url', { params })
      .pipe(map((res: { data: SongUrl[] }) => res.data));
  }

  // 3
  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map(item => item.id).join(',');
    // 5
    // return Observable.create(observer => {
    //   this.getSongUrl(ids).subscribe(urls => {
    //     observer.next(this.generateSongList(songArr, urls));
    //   });
    // });

    return this.getSongUrl(ids).pipe(
      map(urls => this.generateSongList(songArr, urls))
    );
  }

  // 歌曲信息与歌单 数据拼接
  // 4
  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const result = [];
    songs.forEach(song => {
      const url = urls.find(item => item.id === song.id).url;
      if (url) {
        result.push({ ...song, url });
      }
    });
    return result;
  }

  // 请求歌词信息
  getLyric(id: number): Observable<Lyric> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.uri + 'lyric', { params }).pipe(
      map((res: { [key: string]: { lyric: string } }) => {
        if (res.lrc || res.tlyric) {
          return {
            lyric: res.lrc.lyric,
            tlyric: res.tlyric.lyric
          };
        } else {
          return {
            lyric: '',
            tlyric: ''
          };
        }
      })
    );
  }
}
// .pipe(map((res: { [key: string]: { lyric: string; } }) => {
//   return {
//     lyric: res.lrc.lyric,
//     tlyric: res.tlyric.lyric,
//   }
