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
  // 进度条百分比
  sliderValue = 0;
  // 缓存条百分比
  bufferOffset = 0;

  // 当前播放器所有数据
  currentIndex: number;
  currentSong: Song;
  songlist: Song[];
  playList: Song[];

  // 当前播放器显示的信息
  duration: number; // 歌曲总时长(秒)
  currentTime: number; // 当前播放时间(秒)

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
    this.updateCurrentTime(0);
    this.play();
  }
  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index }));
    this.songReady = false; // why
  }

  private updateCurrentTime(time: number) {
    this.audioEl.currentTime = time;
  }

  get picUrl(): string {
    return this.currentSong
      ? this.currentSong.al.picUrl
      : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

  // 播放
  onPlay() {
    this.songReady = true;
    this.play();
  }
  // 暂停
  onPause() {
    this.pause();
  }
  // 播放 | 暂停
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
  // 播放上一首
  onPlayPrev(index: number) {
    // 如是当前是第一首则返回最后一首;
    const newIndex = index <= 0 ? this.playList.length - 1 : index;
    this.updateIndex(newIndex);
  }
  // 播放下一首
  onPlayNext(index: number) {
    // 如是当前最后一首则返回第一首;
    const newIndex = index >= this.playList.length ? 0 : index;
    this.updateIndex(newIndex);
  }
  // 单曲循环
  // onPlayLoop() {
  //   this.loop();
  // }

  // 监听当前播放时间
  onTimeUpdate(event: Event) {
    this.currentTime = (event.target as HTMLAudioElement).currentTime;
    // 进度条更新进度
    this.sliderValue = (this.currentTime / this.duration) * 100;
    // 缓冲条更新进度
    const buffered = this.audioEl.buffered;

    if (buffered.length && this.bufferOffset < 100) {
      const bufferedEnd = buffered.end(0); // 获得缓冲范围的结束位置
      this.bufferOffset = (bufferedEnd / this.duration) * 100;
    }

    // const buffered = this.audioEl.buffered;
    // if (buffered.length && this.bufferPercent < 100) {
  }

  onSliderChange(emit: number) {
    const time = this.duration * (emit / 100);

    this.updateCurrentTime(time);
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
  }
}
