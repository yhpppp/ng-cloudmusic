import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  OnChanges
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from '../../../store';
import {
  getSongList,
  getPlayList,
  getCurrentIndex,
  getPlayMode,
  getCurrentSong,
  getPlayer
} from '../../../store/selectors/player.selector';
import { Song, Singer } from '../../../services/data-types/common.types';
import { PlayMode } from './player-type';
import {
  SetCurrentIndex,
  SetPlayMode,
  SetPlayList
} from '../../../store/actions/player.action';
import { DOCUMENT } from '@angular/common';
import { Subscription, fromEvent } from 'rxjs';
import { shuffle, findIndex } from '../../../utils/array';
import { WyPlayerPanelComponent } from './components/wy-player-panel/wy-player-panel.component';

// 歌曲模式列表哦
const modeList: PlayMode[] = [
  {
    type: 'loop',
    label: '循环'
  },
  {
    type: 'random',
    label: '随机'
  },
  {
    type: 'singleLoop',
    label: '单曲循环'
  }
];

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  @ViewChild('audio', { static: true }) private audio: ElementRef;
  @ViewChild(WyPlayerPanelComponent, { static: true })
  private playerPanel: WyPlayerPanelComponent;
  private audioEl: HTMLAudioElement;
  // 进度条百分比
  sliderValue = 0;
  // 缓存条百分比
  bufferOffset = 0;

  // 当前播放器所有数据
  currentIndex: number;
  currentSong: Song;
  songList: Song[];
  playList: Song[];
  volume: number;

  // 当前播放器显示的信息
  duration: number; // 歌曲总时长(秒)
  currentTime: number; // 当前播放时间(秒)

  // 播放状态

  // 播放中
  playing = false;
  // 是否可以播放
  songReady = false;

  // 显示音量栏
  isShowVolBar = false;

  // 是否点击自身组件
  isSelfClick = false;
  // 初始化全局click时间线订阅容器
  private windowClick: Subscription;

  // 当前歌曲模式
  currentMode: PlayMode;
  modeCount = 0;

  // 显示面板
  isShowListBanel = false;
  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer));

    // const stateArray = [
    //   {
    //     type: getSongList,
    //     fn: list => {
    //       this.watchList(list, 'songlist');
    //     }
    //   },
    //   {
    //     type: getPlayList,
    //     fn: list => {
    //       this.watchList(list, 'playList');
    //     }
    //   },
    //   {
    //     type: getCurrentIndex,
    //     fn: index => {
    //       this.watchCurrentIndex(index);
    //     }
    //   },
    //   {
    //     type: getPlayMode,
    //     fn: mode => {
    //       this.watchMode(mode);
    //     }
    //   },
    //   {
    //     type: getCurrentSong,
    //     fn: song => {
    //       this.watchCurrentSong(song);
    //     }
    //   }
    // ];
    // stateArray.forEach(item => {
    //   appStore$.pipe(select(item.type)).subscribe(item.fn);
    // });
    appStore$
      .pipe(select(getSongList))
      .subscribe(list => this.watchList(list, 'songList'));
    appStore$
      .pipe(select(getPlayList))
      .subscribe(list => this.watchList(list, 'playList'));
    appStore$
      .pipe(select(getCurrentIndex))
      .subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchMode(mode));
    appStore$
      .pipe(select(getCurrentSong))
      .subscribe(song => this.watchCurrentSong(song));
    // appStore$.pipe(select(getCurrentAction)).subscribe(action => this.watchCurrentAction(action));
  }

  private watchCurrentSong(song: Song) {
    if (!song) {
      return;
    }
    this.currentSong = song;
    this.duration = song.dt / 1000;
    // console.log('song :) ', song);
  }

  private watchMode(mode: PlayMode) {
    this.currentMode = mode;
    // console.log('mode :) ', mode);
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(list.slice());
      }
      this.updateCurrentIndex(list, this.currentSong);
      this.store$.dispatch(SetPlayList({ playList: list }));

      // console.log('list :) ', list);
    }
  }
  // 更新当前歌曲
  private updateCurrentIndex(list: Song[], song: Song) {
    const newIndex = findIndex(list, song);
    this.store$.dispatch(SetCurrentIndex({ currentIndex: newIndex }));
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

  private singleLoop() {
    this.updateCurrentTime(0);
    this.play();
    if (this.playerPanel) {
      console.log('111 :) ', 111);

      this.playerPanel.seekLyric(0);
    }
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

  private bindDocumentClickListener() {
    // 有全局click时间线不再创建
    if (this.windowClick) {
      return;
    }
    // 判断是否在其他组件点击
    this.windowClick = fromEvent(this.doc, 'click').subscribe(() => {
      if (!this.isSelfClick) {
        // 点击了播放器以外的部分,隐藏音量
        this.isShowVolBar = false;
        this.isShowListBanel = false;
        this.unbindDocumentClickListener();
      }
      this.isSelfClick = false;
    });
  }
  private unbindDocumentClickListener() {
    if (this.windowClick) {
      return;
    }
    this.windowClick.unsubscribe();
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
    const newIndex = index < 0 ? this.playList.length - 1 : index;

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
  // 更新进度条
  onSliderChange(emit: number) {
    if (!this.currentSong) {
      return;
    }
    const time = this.duration * (emit / 100);
    this.updateCurrentTime(time);
    if (this.playerPanel) {
      this.playerPanel.seekLyric(time * 1000);
    }
  }

  // 改变音量大小
  onVolumeChange(vol: number) {
    this.audioEl.volume = vol / 100; // 0 - 1 音量
  }

  // 切换音量显示
  onVolPanel() {
    this.onTogglePanel('isShowVolBar');
  }
  onTogglePanel(type: string) {
    this[type] = !this[type];
    if (this.isShowVolBar || this.isShowListBanel) {
      this.bindDocumentClickListener();
    } else {
      this.unbindDocumentClickListener();
    }
  }

  // 切换播放模式
  onModeChange() {
    this.store$.dispatch(
      SetPlayMode({ playMode: modeList[++this.modeCount % 3] })
    );
  }
  // 监听播放结束时
  onEnded() {
    if (this.currentMode.type === 'singleLoop') {
      this.singleLoop();
    } else {
      this.onPlayNext(this.currentIndex + 1);
    }
  }

  ngOnInit() {
    this.audioEl = this.audio.nativeElement;
    this.onVolumeChange(10);
    // console.log('this.audioEl.volume :) ', this.audioEl.volume);
  }

  /**
   * 面板子组件
   */

  onChangeSong(song: Song) {
    this.updateCurrentIndex(this.playList, song);
  }

  onListPanel() {
    if (this.playList.length) {
      this.onTogglePanel('isShowListBanel');
    }
  }
}
