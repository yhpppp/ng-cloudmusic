import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList
} from '@angular/core';
import { Song } from '../../../../../services/data-types/common.types';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { findIndex } from '../../../../../utils/array';
import { timer } from 'rxjs';
import { SongService } from '../../../../../services/song.service';
import { BaseLyricLine, WyLyric } from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnChanges, OnInit {
  @Input() songlist: Song[];
  @Input() currentSong: Song;
  currentIndex: number;
  @Input() show: boolean;
  @Input() playing: boolean;
  @Output() opChangeSong = new EventEmitter<Song>();
  @Output() opClose = new EventEmitter();
  scrollY = 0;
  // 歌词
  currentLyric: BaseLyricLine[];

  private lyric: WyLyric;
  currentLineNum: number;
  private lyricRefs: NodeList;

  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<
    WyScrollComponent
  >;
  constructor(private songService: SongService) {}
  // 更新滚动条位置
  private scrollToCurrent(speed = 300) {
    // 获取当前列表所有li
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll(
      'ul li'
    );
    if (songListRefs.length) {
      const currentLi = songListRefs[this.currentIndex || 0];
      // console.log('currentLi :) ', currentLi);

      const offsetTop = currentLi.offsetTop;
      const offsetHeight = currentLi.offsetHeight;
      // console.log('offsetTop :) ', offsetTop);
      // console.log('this.scrollY :) ', this.scrollY);

      // 下一首 || 上一首
      if (
        offsetTop - Math.abs(this.scrollY) > offsetHeight * 5 ||
        offsetTop < Math.abs(this.scrollY)
      ) {
        this.wyScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }

  //
  handleLyric(startLine = 2) {
    this.lyric.handler.subscribe(({ lineNum }) => {
      console.log('lineNum :) ', lineNum);
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll(
          'ul li'
        );
        // console.log('this.lyricRefs :) ', this.lyricRefs);
      }

      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        // console.log('startLine :) ', startLine);

        if (lineNum > startLine) {
          const targetLine = this.lyricRefs[lineNum - startLine];
          if (targetLine) {
            this.wyScroll.last.scrollToElement(targetLine, 300, false, false);
          }
        }
      } else {
        this.wyScroll.last.scrollTo(0, 0);
      }
    });
  }
  // 更新歌词信息
  private updateLyric() {
    this.resetLyric();
    this.songService.getLyric(this.currentSong.id).subscribe(res => {
      // console.log('res :) ', res);
      this.lyric = new WyLyric(res);

      this.currentLyric = this.lyric.lines;
      // 歌词返回顶部
      this.wyScroll.last.scrollTo(0, 0);

      const startLine = res.tlyric ? 1 : 2;
      // console.log('startLine :) ', startLine);

      this.handleLyric(startLine);
      if (this.playing) {
        this.lyric.play();
      }
    });
  }

  private resetLyric() {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
      this.currentLyric = [];
      this.currentLineNum = 0;
      this.lyricRefs = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes :) ', changes);
    const show = 'show';
    const currentSong = 'currentSong';
    const songlist = 'songlist';
    const playing = 'playing';

    // 监听 show 的改变
    if (changes[show]) {
      // console.log('currentIndex :) ', this.currentIndex);

      // 更新显示滚动条
      if (!changes[show].firstChange && this.show) {
        // 刷新面板
        this.wyScroll.first.asyncRefresh();
        this.wyScroll.last.asyncRefresh();
        // 打开面板时滚动到当前位置

        timer(90).subscribe(() => {
          this.scrollToCurrent(0);
        });
      }
    }

    if (changes[songlist]) {
      this.currentIndex = 0;
    }

    // 监听当前歌曲的改变
    if (changes[currentSong]) {
      // console.log('currentSong :) ', this.currentSong);

      if (this.currentSong) {
        if (this.currentSong) {
          // 更新当前歌曲下标
          this.currentIndex = findIndex(this.songlist, this.currentSong);
          // 更新当前歌词信息
          this.updateLyric();
          if (this.show) {
            // 切歌时滚动位置更新
            this.scrollToCurrent();
          }
        } else {
          this.resetLyric();
        }
      }
    }

    // 监听播放状态暂停或滚动歌词
    if (changes[playing]) {
      if (!changes[playing].firstChange && this.lyric !== undefined) {
        this.lyric.togglePlay(this.playing);
      }
    }
  }

  ngOnInit() {}
}
