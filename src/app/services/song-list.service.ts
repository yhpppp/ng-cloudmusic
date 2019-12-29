import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONF } from './services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SongList, Song } from './data-types/common.types';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { SongService } from './song.service';

@Injectable({
  providedIn: ServicesModule
})
export class SongListService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONF) private uri: string,
    private songService: SongService
  ) {}

  // 获取歌单详情数据
  getSongListDetail(id: number): Observable<SongList> {
    const params = new HttpParams().set('id', id.toString());
    return this.http
      .get(this.uri + 'playlist/detail', { params })
      .pipe(map((res: { playlist: SongList }) => res.playlist));
  }

  // 获取歌单详情数据中的每首歌
  // 2
  playSongList(id: number): Observable<Song[]> {
    return this.getSongListDetail(id).pipe(
      pluck('tracks'),
      switchMap(tracks => this.songService.getSongList(tracks))
    );
  }
}
