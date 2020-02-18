import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Banner,
  HotTag,
  SongList,
  Singer
} from '../../services/data-types/common.types';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SongListService } from '../../services/song-list.service';
import { Store } from '@ngrx/store';
import { AppStoreModule } from '../../store';
import {
  SetCurrentIndex,
  SetPlayList,
  SetSongList
} from '../../store/actions/player.action';

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
    private route: ActivatedRoute,
    private songListService: SongListService,
    private store$: Store<AppStoreModule>
  ) {
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
  // 1
  onPlayList(id: number) {
    // console.log('on :) ');

    this.songListService.playSongList(id).subscribe(res => {
      console.log('res :) ', res);
      this.store$.dispatch(SetCurrentIndex({ currentIndex: 0 }));
      this.store$.dispatch(SetPlayList({ playList: res }));
      this.store$.dispatch(SetSongList({ songList: res }));
    });
  }
}
