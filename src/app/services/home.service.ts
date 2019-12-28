import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONF } from './services.module';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Banner, HotTag, SongList } from './data-types/common.types';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: ServicesModule
})
export class HomeService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONF) private uri: string
  ) {}

  /**
   * 请求获取=>首页轮播图数据
   */
  getBanners(): Observable<Banner[]> {
    return this.http
      .get(this.uri + 'banner')
      .pipe(map((res: { banners: Banner[] }) => res.banners));
  }

  /**
   * 请求获取=>热门歌单分类
   */
  getHotTags(): Observable<HotTag[]> {
    return this.http
      .get(this.uri + 'playlist/hot')
      .pipe(
        map((res: { tags: HotTag[] }) =>
          res.tags
            .sort((a: HotTag, b: HotTag) => a.position - b.position)
            .slice(0, 5)
        )
      );
  }

  /**
   * 请求获取=>推荐歌单
   */
  getPersonalSongList() {
    return this.http
      .get(this.uri + 'personalized')
      .pipe(map((res: { result: SongList[] }) => res.result.slice(0, 16)));
  }
}
