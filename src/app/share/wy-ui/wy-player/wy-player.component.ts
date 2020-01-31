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
import { SetCurrentIndex } from '../../../store/actions/player.action';

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
  // 当前播放器所有数据
  currentIndex: number;
  currentSong: Song;
  songlist: Song[];
  playList: Song[];

  // 当前播放器显示的信息
  duration: number;
  currentTime: number;

  // 播放状态

  // 播放中
  playing = false;
  // 是否可以播放
  songReady = false;

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
    this.playing = true;
  }

  private pause() {
    this.audioEl.pause();
  }

  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
  }
  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false; // why
  }

  get picUrl(): string {
    return this.currentSong
      ? this.currentSong.al.picUrl
      : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

  onPlay() {
    this.songReady = true;
    this.play();
  }
  onPause() {
    this.pause();
  }

  onPlayToggle() {
    if (this.songReady) {
      this.playing = !this.playing;
      if (this.playing) {
        this.onPlay();
      } else {
        this.onPause();
      }
    }
  }

  onPlayPrev(index: number) {
    // 如是当前是第一首则返回最后一首;
    const newIndex = index <= 0 ? this.playList.length - 1 : index;
    this.updateIndex(newIndex);
  }

  onPlayNext(index: number) {
    // 如是当前最后一首则返回第一首;
    const newIndex = index >= this.playList.length ? 0 : index;
    this.updateIndex(newIndex);
  }
  onPlayLoop() {
    this.loop();
  }

  onTimeUpdate(event: Event) {
    this.currentTime = (event.target as HTMLAudioElement).currentTime;
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }
}
