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
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';

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

  constructor(private route: ActivatedRoute) {
    this.route.data
      .pipe(map(res => res.homeDatas))
      .subscribe(([banners, hotTags, songList, singer]) => {
        this.banners = banners;
        this.hotTags = hotTags;
        this.songList = songList;
        this.singers = singer;
      });
  }

  ngOnInit() {}

  onNzBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }
}
