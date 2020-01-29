import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from '../../../store';
import {
  getSongList,
  getPlayList,
  getCurrentIndex,
  getPlayMode,
  getCurrentSong
} from '../../../store/selectors/player.selector';
import { Song } from '../../../services/data-types/common.types';
import { PlayMode } from './player-type';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  @ViewChild('audio', { static: true }) private audio: ElementRef;
  private audioEl: HTMLAudioElement;
  sliderValue = 66;
  bufferOffset = 88;

  currentIndex: number;
  currentSong: Song;
  songlist: Song[];
  playList: Song[];

  // 当前播放器显示的信息
  duration: number;
  currentTime: number;

  constructor(private store$: Store<AppStoreModule>) {
    const appStore$ = this.store$.pipe(select('player'));

    const stateArray = [
      {
        type: getSongList,
        fn: list => {
          this.watchList(list, 'songlist');
        }
      },
      {
        type: getPlayList,
        fn: list => {
          this.watchList(list, 'playList');
        }
      },
      {
        type: getCurrentIndex,
        fn: index => {
          this.watchCurrentIndex(index);
        }
      },
      {
        type: getPlayMode,
        fn: mode => {
          this.watchMode(mode);
        }
      },
      {
        type: getCurrentSong,
        fn: song => {
          this.watchCurrentSong(song);
        }
      }
    ];

    stateArray.forEach(item => {
      appStore$.pipe(select(item.type)).subscribe(item.fn);
    });
  }

  private watchCurrentSong(song: Song) {
    if (!song) {
      return;
    }
    this.currentSong = song;
    this.duration = song.dt / 1000;
    console.log('song :) ', song);
  }

  private watchMode(mode: PlayMode) {
    // this.songMode = mode
    // console.log('mode :) ', mode);
  }

  private watchList(list: Song[], type: string) {
    this[type] = list;
    // console.log('list, type watchList :) ', list, type);
  }

  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
    // console.log('currentIndex :) ', index);
  }

  private play() {
    this.audioEl.play();
  }

  get picUrl(): string {
    return this.currentSong
      ? this.currentSong.al.picUrl
      : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

  onPlay() {
    this.play();
  }

  onTimeUpdate(event: Event) {
    this.currentTime = (event.target as HTMLAudioElement).currentTime;
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }
}
