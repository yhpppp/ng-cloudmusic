import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HomeService } from '../../services/home.service';
import { SingerService } from '../../services/singer.service';
import { forkJoin, Observable } from 'rxjs';
import {
  Banner,
  HotTag,
  SongList,
  Singer
} from '../../services/data-types/common.types';

type HomeDataType = [Banner[], HotTag[], SongList[], Singer[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(
    private homeService: HomeService,
    private singerService: SingerService
  ) {}

  resolve(): Observable<HomeDataType> {
    return forkJoin([
      this.homeService.getBanners(),
      this.homeService.getHotTags(),
      this.homeService.getPersonalSongList(),
      this.singerService.getEnterSinger()
    ]);
  }
}
