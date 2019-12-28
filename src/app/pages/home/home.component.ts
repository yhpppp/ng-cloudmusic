import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Banner,
  HotTag,
  SongList,
  Singer
} from '../../services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { HomeService } from '../../services/home.service';
import { SingerService } from '../../services/singer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  hotTags: HotTag[];
  songList: SongList[];
  singers: Singer[];

  @ViewChild(NzCarouselComponent, { static: true })
  private nzCarousel: NzCarouselComponent;

  constructor(
    private homeService: HomeService,
    private singerService: SingerService
  ) {
    this.getBanners();
    this.getHotTags();
    this.getPersonalSongList();
    this.getEnterSinger();
  }

  ngOnInit() {}

  getBanners() {
    this.homeService.getBanners().subscribe(banners => {
      this.banners = banners;
    });
  }

  getHotTags() {
    this.homeService.getHotTags().subscribe(hotTags => {
      this.hotTags = hotTags;
    });
  }

  getPersonalSongList() {
    this.homeService.getPersonalSongList().subscribe(songList => {
      this.songList = songList;
    });
  }

  getEnterSinger() {
    this.singerService.getEnterSinger().subscribe(singers => {
      this.singers = singers;
    });
  }

  onNzBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }
}
